using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Types;
using Nova_DMS.Services;

namespace Nova_DMS.Controllers;

[Route("api/file/{name}")]
[ApiController]
public class FileController : Controller
{
    private readonly IMinIoService _minIoService;
    private readonly SqlConnection? _db;

    public FileController(IMinIoService ms, IConfiguration config)
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
    public async Task<string> GetFileAsync(string name)
    {
        return await _minIoService.GetObjectURLAsync(name);
    }

    [HttpPost]
    public async Task<int> UploadFileAsync(string name, string ContentType, IFormFile file, string Dir, int UserId)
    {
        var fs = file.OpenReadStream();
        
        await _minIoService.UploadObjectAsync(name, ContentType, fs);

        try
        {
            string InsertSql = "INSERT INTO NOV.FILES VALUES(@RepoId, @Name, @Dir)" +
                                "SELECT CAST(SCOPE_IDENTITY() AS INT)";
        
            int fileId = _db.Query<int>(InsertSql, param : new { RepoId = 0, Name = name, Dir = SqlHierarchyId.Parse(Dir)}).Single();
        
            InsertSql = "INSERT INTO NOV.FILES_USERS VALUES (@FileId, @UserId, 2)";
        
            await _db.ExecuteAsync(InsertSql, param:  new { FileId = fileId, UserId = UserId });
            
            return fileId;
        }
        catch
        {
            return -1;
        }
        
        //TODO:
        // - HeirarchyId will not work, look for another way
        // - Add file metadata to ElasticSearch db
    }
}
