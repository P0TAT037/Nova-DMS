using System.Collections;
using System.Linq;
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
    [Route("/{versionId}")]
    [AuthorizeNode]
    public async Task<List<byte>> GetVersionAsync(string id, string versionId)
    {
        return await _minIoService.GetObjectAsync(id, versionId: versionId);
    }

    [HttpGet]
    [Route("versions")]
    [AuthorizeNode]
    public List<Tuple<string, string>> GetVersions(string id)
    {
        return _minIoService.GetVersions(id);
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
    [Authorize]
    public async Task<IActionResult> UploadAsync([FromForm]NodeDataDTO nodeDataDTO, IFormFile? file)
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        try
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var param = new DynamicParameters();
                param.Add("@Name", nodeDataDTO.Name);
                param.Add("@Dir", nodeDataDTO.Dir);
                param.Add("@isFolder", nodeDataDTO.Type == "folder");
                param.Add("@return", direction: ParameterDirection.ReturnValue);
               
                await _db.ExecuteAsync("dbo.AddNode", param, commandType: CommandType.StoredProcedure);
                int fileId = param.Get<int>("@return");
                
                param = new DynamicParameters();
                param.Add("@FileId", fileId);
                param.Add("@id", UserId);
                param.Add("@perm", nodeDataDTO.DefaultPerm);
                _db.Execute("dbo.PermitNode", param, commandType: CommandType.StoredProcedure);
                
                if (!nodeDataDTO.Type.Equals("folder"))
                {
                    var fs = file!.OpenReadStream();
                    await _minIoService.UploadObjectAsync(fileId.ToString(), nodeDataDTO.Type, fs);
                }

                var userName = await _db.QuerySingleAsync<string>("select NAME from NOV.USERS where ID = @ID", param: new { ID= UserId });
                
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
                    Version = 1
                };

                var response = _elasticClient.IndexDocument(metadata);
                if (!response.IsValid)
                {
                    throw new Exception(response.DebugInformation);
                }
                transaction.Complete();

                return Ok(fileId);
            }
        }
        catch (Exception e) {
            await Console.Out.WriteLineAsync(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }        
    }

    //TODO:
    [HttpPut]
    [AuthorizeNode(perm: 1)]
    public async Task<IActionResult> UpdateAsync([FromForm]Metadata metadata, IFormFile? file)
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        var fileId = metadata.Id;
        try
        {

            if (!metadata.Type.Equals("folder") && file != null)
            {
                var fs = file!.OpenReadStream();
                await _minIoService.UploadObjectAsync(fileId.ToString(), metadata.Type, fs);
            }
            var userName = await _db.QuerySingleAsync<string>("select NAME from NOV.USERS where ID = @ID", param: new { ID= UserId });

            metadata.EditedBy = userName;
            metadata.Updated = DateTime.Now;
            metadata.Version = metadata.Version+1;
            
            var response = _elasticClient.IndexDocument(metadata);
            if (!response.IsValid)
            {
                System.Console.WriteLine(response.DebugInformation);
                throw new Exception(response.DebugInformation);
            }

            return Ok(fileId);
            
        }
        catch (Exception e) {
            await Console.Out.WriteLineAsync(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete]
    [AuthorizeNode(perm: 1)]
    public async Task DeleteFileAsync(string id, string? versionId, bool? lastVersion) 
    {
        await _minIoService.RemoveObjectAsync(id, versionId);
        if(versionId == null)
        {
            await _elasticClient.DeleteAsync<Metadata>(id);
            return;
        }
        
        if(lastVersion == true)
        {
            var result = await GetMetadataAsync(new List<string> { id });
            var metadata = result.FirstOrDefault<Metadata>();
            metadata!.Version = metadata!.Version - 1;
            var response = _elasticClient.IndexDocument(metadata);
        }
    }

    [HttpDelete]
    [Route("deleteFolder")]
    [AuthorizeNode(perm: 1)]
    public async Task DeleteFolderAsync(string id)
    {
        var nodes = await GetNodesAsync(id);
        foreach(var node in nodes)
        {
            await DeleteFileAsync(node.Id.ToString(), null, null);
        }
    }

}