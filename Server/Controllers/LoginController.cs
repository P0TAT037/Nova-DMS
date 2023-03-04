using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using System.Data.Common;

namespace Nova_DMS.Controllers
{
    [Route("/user")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private string? _ConnectionString;
        private SqlConnection? _db;

        public LoginController(IConfiguration config) {
            try
            {
                _ConnectionString = config.GetConnectionString("SQLServer");
                _db = new SqlConnection(_ConnectionString);

            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        
        
        [HttpGet]
        public IEnumerable<User> LogIn(string username, string password) {
            var param = new { username = username, password = password };
            return _db.Query<User>("SELECT NAME FROM NOV.USERS WHERE USERNAME = @username AND PASSWORD = @password", param);
        }

        [HttpPost]
        public int SignUp(string name, string username, string password) {
            var param = new {name = name, username = username, password = password};
            try
            {
                return _db.Execute("INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)", param);

            }
            catch
            {

                return 0;
            }
        }
    }
}
