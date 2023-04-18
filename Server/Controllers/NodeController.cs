﻿using System.Linq;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Types;
using Nest;
using Nova_DMS.Models;
using Nova_DMS.Models.DTOs;
using Nova_DMS.Security;
using Nova_DMS.Services;
using System.Collections.Specialized;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Transactions;

namespace Nova_DMS.Controllers;


[Route("/node")]
[ApiController]
public class NodeController : ControllerBase
{
    private readonly IObjStorageService _minIoService;
    private readonly SqlConnection _db = null!;
    private readonly IElasticClient _elasticClient = null!;
    private readonly IConfiguration _config;

    public NodeController(IObjStorageService ms, IElasticClient es, IConfiguration config)
    {
        _config = config;
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
    [AuthorizeNode]
    public async Task<string> GetAsync(string id)
    {
        return await _minIoService.GetObjectURLAsync(id);
    }

    
    [HttpGet]
    [Route("metadata")]
    public async Task<Metadata> GetMetadataAsync(string id)
    {
        var result = await _elasticClient.SearchAsync<Metadata>(s => s.Query(
            q => q.Term(t => t.Id, id)
            )
        );
        return result.Documents.FirstOrDefault<Metadata>()!;
    }

    private async Task<IEnumerable<Metadata>> GetMetadataAsync(List<string> ids)
    {
        var result = await _elasticClient.SearchAsync<Metadata>(s => s.Query(
            q => q.Ids(id => id.Values(ids))
            )
        );
        return result.Documents!;
    }

    [HttpGet]
    [Route("getNodes")]
    [Authorize]
    public async Task<IEnumerable<Node>> GetNodesAsync(string hierarchyId)
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var userId = jwt.Claims.First(c => c.Type == "id").Value;
        DynamicParameters param = new DynamicParameters();
        param.Add("userId", userId);
        param.Add("hierarchyId", hierarchyId);
        var results = await _db.QueryAsync<Node>("SELECT * from NOV.GetNodes(@userId, cast(@hierarchyId as hierarchyid))", param);
        var metadata = await GetMetadataAsync(results.Select(r => r.Id.ToString()).ToList());
        for(int i = 0; i < results.Count(); i++)
        {
            results.ElementAt(i).Metadata = metadata.ElementAt(i);
        }
        return results;
    }

    [HttpPost]
    public async Task<IActionResult> UploadAsync([FromForm]NodeDataDTO nodeDataDTO, IFormFile? file)
    {
        
        try
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var param = new DynamicParameters();
                param.Add("@Name", nodeDataDTO.Name);
                param.Add("@Dir", nodeDataDTO.Dir);
                param.Add("@return", direction: ParameterDirection.ReturnValue);
               
                _db.Execute("dbo.AddNode", param, commandType: CommandType.StoredProcedure);
                int fileId = param.Get<int>("@return");

                if (!nodeDataDTO.Type.Equals("folder"))
                {
                    param = new DynamicParameters();
                    param.Add("@FileId", fileId);
                    param.Add("@id", nodeDataDTO.UserId);
                    param.Add("@perm", nodeDataDTO.DefaultPerm);
                    _db.Execute("dbo.PermitNode", param, commandType: CommandType.StoredProcedure);
                    
                    var fs = file.OpenReadStream();
                    await _minIoService.UploadObjectAsync(fileId.ToString(), nodeDataDTO.Type, fs);   
                }
                
                var userName = await _db.QuerySingleAsync<string>("select NAME from NOV.USERS where ID = @ID", param: new { ID=nodeDataDTO.UserId });
                
                Metadata metadata = new Metadata { 
                    Id = fileId,
                    Name = nodeDataDTO.Name,
                    Type = nodeDataDTO.Type,
                    Description = nodeDataDTO.Description,
                    Content = nodeDataDTO.Content,
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