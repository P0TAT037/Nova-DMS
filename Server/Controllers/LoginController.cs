using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using System.Data.Common;

namespace Nova_DMS.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class LoginController : Controller
    {
        private SqlConnection? _db;

        public LoginController(IConfiguration config, SqlConnection conn) {
            try
            {
                var _ConnectionString = config.GetConnectionString("SQLServer");
                conn.ConnectionString = _ConnectionString;
                _db = conn;

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
             
        [HttpGet]
        public IEnumerable<User> LogIn(string username, string password) {
            var param = new { username, password };
            return _db.Query<User>("SELECT NAME FROM NOV.USERS WHERE USERNAME = @username AND PASSWORD = @password", param);
        }

        [HttpPost]
        public int SignUp(string name, string username, string password) {
            var param = new {name = name, username = username, password = password};
            try
            {
                var sql = "INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)" +
                          "SELECT CAST(SCOPE_IDENTITY() AS INT)";
                    return _db.Query<int>(sql, param).Single();

            }
            catch
            {

                return -1;
            }
        }
    }
}
