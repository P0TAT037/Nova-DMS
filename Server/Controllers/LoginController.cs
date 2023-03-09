using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using System.Data.Common;

namespace Nova_DMS.Controllers;

[Route("api/user")]
[ApiController]
public class LoginController : Controller
{
    private readonly SqlConnection? _db = null!;

    public LoginController(IConfiguration config) {
        try
        {
            var _ConnectionString = config.GetConnectionString("SQLServer");
            _db = new SqlConnection(_ConnectionString);

        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
         
    [HttpGet]
    public async Task<IEnumerable<User>> LogIn(string username, string password) {
        var param = new { username, password };
        return await _db.QueryAsync<User>("SELECT NAME FROM NOV.USERS WHERE USERNAME = @username AND PASSWORD = @password", param);
    }

    [HttpPost]
    public async Task<IEnumerable<int>> SignUp(string name, string username, string password) {
        var param = new {name = name, username = username, password = password};
        
        var sql = "INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)" +
                    "SELECT CAST(SCOPE_IDENTITY() AS INT)";
        return await _db.QueryAsync<int>(sql, param);
        
    }
}
