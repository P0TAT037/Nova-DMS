using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using Nova_DMS.Services;

namespace Nova_DMS.Controllers
{
    [Route("api/getNodes/")]
    [ApiController]
    public class FileTreeController : Controller
    {
        private readonly SqlConnection? _db;

        public FileTreeController(IMinIoService ms, IConfiguration config)
        {
            
             var _ConnectionString = config.GetConnectionString("SQLServer");
             _db = new SqlConnection(_ConnectionString);
           
        }

        [HttpGet]
        public async Task<IEnumerable<Obj>> Get(int userId, int repoId, string hierarchyId)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("userId", userId);
            param.Add("repoId", repoId);
            param.Add("hierarchyId", hierarchyId);
            return await _db.QueryAsync<Obj>("SELECT * from NOV.GetNodes(@userId, @repoId, cast(@hierarchyId as hierarchyid))", param);
            
        }
    }
}
