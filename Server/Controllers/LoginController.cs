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

[Route("/user")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly string _connectionString  = null!;
    private readonly IConfiguration _config;
    private readonly SqlConnection _db;

    public LoginController(IConfiguration config, SqlConnection db) {
        _config = config;
        _connectionString = config.GetConnectionString("SQLServer")!;
        _db = db;

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
        
        //TODO: add user roles to the user model and the token claims.
        var user = new User { Id = result.Id, Username= username ,Level = result.Level};
        var roles = _db.Query<Role>
        ("Select Nov.ROLES.ID, NOV.ROLES.Name FROM NOV.ROLES join NOV.USERS_ROLES on (NOV.ROLES.ID = NOV.USERS_ROLES.USER_ID) Where NOV.Roles.ID = @UserId"
        , param: new{UserId = user.Id});
        string token = GenerateToken(user, roles);
        
        return Ok(new { result.Name, token });
    }

    private string GenerateToken(User user, IEnumerable<Role> roles)
    {
        List<Claim> claims = new List<Claim>()
        {
            new Claim("id", user.Id.ToString()!),
            new Claim("username", user.Username),
            new Claim("level", user.Level.ToString()),
            new Claim ("roles", String.Join(",", roles.Select(r => (r.Id, r.Name))))
        };

        var issuer = _config["JWT:Issuer"];

        var audience = _config["JWT:Audience"];

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));

        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

        var token = new JwtSecurityToken(issuer: issuer, audience:audience, claims: claims, signingCredentials: cred, expires: DateTime.Now.AddDays(1));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


}
