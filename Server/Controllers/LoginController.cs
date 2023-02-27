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
        private IConfiguration? config;
        private string? ConnectionString;
        private SqlConnection db;

        public LoginController() {
            try
            {
                config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
                ConnectionString = config.GetConnectionString("SQLServer");
                db= new SqlConnection(ConnectionString);

            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        
        
        [HttpGet]
        public IEnumerable<User> LogIn(string username, string password) {
            var param = new { username = username, password = password };
            return db.Query<User>("SELECT NAME FROM NOV.USERS WHERE USERNAME = @username AND PASSWORD = @password", param);
        }

        [HttpPost]
        public int SignUp(string name, string username, string password) {
            var param = new {name = name, username = username, password = password};
            try
            {
                return db.Execute("INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)", param);

            }
            catch
            {

                return 0;
            }
        }
    }
}
