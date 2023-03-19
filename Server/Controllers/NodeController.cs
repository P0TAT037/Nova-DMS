using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Types;
using Nest;
using Nova_DMS.Models;
using Nova_DMS.Services;
using System.Collections.Specialized;
using System.Data;
using System.Transactions;

namespace Nova_DMS.Controllers;

[Route("api/node/")]
[ApiController]
public class NodeController : ControllerBase
{
    private readonly IObjStorageService _minIoService;
    private readonly SqlConnection _db = null!;
    private readonly IElasticClient _elasticClient = null!;

    public NodeController(IObjStorageService ms, IElasticClient es, IConfiguration config)
    {
        try
        {
            var _ConnectionString = config.GetConnectionString("SQLServer");
            _db = new SqlConnection(_ConnectionString);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        _minIoService = ms;
        _elasticClient = es;
    }

    [HttpGet]
    //[Authorize]
    public async Task<string> GetAsync([FromRoute] string id)
    {
        return await _minIoService.GetObjectURLAsync(id);
    }

    
    [HttpGet]
    [Route("metadata")]
    public async Task<IActionResult> GetMetadataAsyc([FromRoute] string id)
    {
        var result = await _elasticClient.SearchAsync<Metadata>(q => q.Query(
            q => q.Term(t => t.Id, id)
            )
        );
        return Ok(result.Documents);
    }

    [HttpGet]
    [Route("getNodes")]
    public async Task<IEnumerable<Node>> Get([FromRoute]int userId, string hierarchyId)
    {
        DynamicParameters param = new DynamicParameters();
        param.Add("userId", userId);
        param.Add("hierarchyId", hierarchyId);
        return await _db.QueryAsync<Node>("SELECT * from NOV.GetNodes(@userId, cast(@hierarchyId as hierarchyid))", param);

    }

    [HttpPost]
    public async Task<IActionResult> UploadAsync([FromForm] string Dir, [FromForm]int UserId, IFormFile? file,
        [FromForm] string name, [FromForm] string type, [FromForm] string? description, [FromForm] string? content,
        [FromForm] bool? defaultPerm = null
        )
    {
        
        try
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var param = new DynamicParameters();
                param.Add("@Name", name);
                param.Add("@Dir", Dir);
                param.Add("@return", direction: ParameterDirection.ReturnValue);
               
                _db.Execute("dbo.AddNode", param, commandType: CommandType.StoredProcedure);
                int fileId = param.Get<int>("@return");

                if (!type.Equals("folder"))
                {
                    param = new DynamicParameters();
                    param.Add("@FileId", fileId);
                    param.Add("@id", UserId);
                    param.Add("@perm", defaultPerm);
                    _db.Execute("dbo.PermitNode", param, commandType: CommandType.StoredProcedure);
                    
                    var fs = file.OpenReadStream();
                    await _minIoService.UploadObjectAsync(fileId.ToString(), type, fs);
                    
                }
                
                var userName = await _db.QuerySingleAsync<string>("select NAME from NOV.USERS where ID = @ID", param: new { ID=UserId });
                
                Metadata metadata = new Metadata { 
                    Id = fileId,
                    Name = name,
                    Type = type,
                    Description = description,
                    Content = content,
                    Author = userName,
                    Created = DateTime.Now,
                    Updated = DateTime.Now,
                    EditedBy = userName,
                    Version = 0
                };
                
                await _elasticClient.IndexDocumentAsync(metadata);
                
                transaction.Complete();

                return Ok(fileId);
            }
        }
        catch (Exception e) {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest();
        }        
    }

    //TODO:
    [HttpPut]
    public async Task<int> UpdateAsync()
    {
        throw new NotImplementedException();
    }

    [HttpDelete]
    public async Task<int> DeleteAsync() 
    {
        throw new NotImplementedException();
    }

}