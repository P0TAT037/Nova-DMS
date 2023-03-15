using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Types;
using Nova_DMS.Services;
using System.Collections.Specialized;
using System.Data;
using System.Transactions;

namespace Nova_DMS.Controllers;

[Route("api/node/")]
[ApiController]
public class NodeController : Controller
{
    private readonly IObjStorageService _minIoService;
    private readonly SqlConnection? _db;

    public NodeController(IObjStorageService ms, IConfiguration config)
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
    }

    [HttpGet]
    //[Authorize]
    public async Task<string> GetFileAsync(string id)
    {
        //ToDo:
        // -Get file metadata from elasticsearch and return it with the link
        return await _minIoService.GetObjectURLAsync(id);
    }

    [HttpPost]
    public async Task<int> UploadFileAsync(string name, string ContentType, IFormFile file, int RepoId, string Dir, int UserId, bool IsFolder)
    {
        
        int fileId = -1;
        try
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var param = new DynamicParameters();
                param.Add("@RepoId", RepoId);
                param.Add("@Name", name);
                param.Add("@Dir", Dir);
                param.Add("@return", direction: ParameterDirection.ReturnValue);
               
                _db.Execute("dbo.AddNode", param, commandType: CommandType.StoredProcedure);
                fileId = param.Get<int>("@return");

                if (!IsFolder)
                {
                    param = new DynamicParameters();
                    param.Add("@UsrId", UserId);
                    param.Add("@FileId", fileId);
                    _db.Execute("dbo.PermitNode", param, commandType: CommandType.StoredProcedure);
                }

                var fs = file.OpenReadStream();
                await _minIoService.UploadObjectAsync(fileId.ToString(), ContentType, fs);

                transaction.Complete();
            }
        }
        catch (Exception) { }
        return fileId;
        
        //TODO:
        // - Add file metadata to ElasticSearch db

    }

}

