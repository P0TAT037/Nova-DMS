using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Nova_DMS.Models;
using Nova_DMS.Models.DTOs;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Nova_DMS.Controllers;

[Route("api/user")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly string _connectionString  = null!;
    private readonly IConfiguration _config;

    public LoginController(IConfiguration config) {
        _config = config;
        _connectionString = config.GetConnectionString("SQLServer")!;

    }

    //TODO: queries to stored procedures
    [HttpPost]
    public async Task<IActionResult> SignUp(string name, string username, string password) {

        var param = new {name = name, username = username, password = BCrypt.Net.BCrypt.HashPassword(password)};
        
        var sql = "INSERT INTO NOV.USERS (NAME, USERNAME, PASSWORD) VALUES (@name, @username, @password)" +
                    "SELECT CAST(SCOPE_IDENTITY() AS INT)";

        int id;
        try
        {
            using(var _db = new SqlConnection(_connectionString))
            {
                id = await _db.QuerySingleAsync<int>(sql, param);
            }
            return Ok(id);
        }
        catch (Exception)
        {

            return BadRequest("username already exists");
        }
        
        
    }

         
    [HttpGet]
    public async Task<IActionResult> LogIn(string username, string password) {
        
        var param = new DynamicParameters();
        param.Add("@username", username);
        UserDTO? result;
        using (var _db = new SqlConnection(_connectionString)) { 
            result =  await _db.QueryFirstOrDefaultAsync<UserDTO>("Select * FROM NOV.GetUser(@username)", param);
        }
        
        if (result is null || !BCrypt.Net.BCrypt.Verify(password, result.Password)) {
            return BadRequest("wrong username or password");
        }
        
        var user = new User { Id = result.Id, Username= username ,Level = result.Level};
        string token = CreatToken(user);
        
        return Ok(new { result.Name, token });
    }

    private string CreatToken(User user)
    {
        List<Claim> claims = new List<Claim>()
        {
            new Claim("Id", user.ToString()!),
            new Claim("Username", user.Username),
            new Claim("Level", user.Level.ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));

        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

        var token = new JwtSecurityToken(claims: claims, signingCredentials: cred, expires: DateTime.Now.AddDays(1));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


}
