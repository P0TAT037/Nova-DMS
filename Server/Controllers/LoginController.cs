using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using System.ComponentModel;
using System.Data;
using System.Data.Common;

namespace Nova_DMS.Controllers;

[Route("api/user")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly string _connectionString  = null!;

    public LoginController(IConfiguration config) {
        
        _connectionString = config.GetConnectionString("SQLServer")!;

    }
         
    [HttpGet]
    public async Task<User> LogIn(string username, string password) {
        var param = new DynamicParameters();
        param.Add("@username", username);
        param.Add("@password", password);
        
        using (var _db = new SqlConnection(_connectionString)) { 
            return await _db.QueryFirstOrDefaultAsync<User>("Select * FROM NOV.GetUser(@username, @password)", param);
        }
    }

    [HttpPost]
    public async Task<IEnumerable<int>> SignUp(string name, string username, string password) {

        var param = new {name = name, username = username, password = password};
        
        var sql = "INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)" +
                    "SELECT CAST(SCOPE_IDENTITY() AS INT)";
        
        using(var _db = new SqlConnection(_connectionString))
        {
            return await _db.QueryAsync<int>(sql, param);
        }
    }
}
