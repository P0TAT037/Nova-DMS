using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using Nova_DMS.Services;

namespace Nova_DMS.Controllers
{
    [Route("api/getNodes/")]
    [ApiController]
    public class TreeController : ControllerBase
    {
        private readonly SqlConnection? _db;

        public TreeController(IObjStorageService ms, IConfiguration config)
        {
            
             var _ConnectionString = config.GetConnectionString("SQLServer");
             _db = new SqlConnection(_ConnectionString);
           
        }

    }
}
