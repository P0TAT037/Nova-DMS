using Dapper;
using Microsoft.AspNetCore.Authorization;
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

[Route("/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly string _connectionString  = null!;
    private readonly IConfiguration _config;
    private readonly SqlConnection _db;

    public AuthController(IConfiguration config, SqlConnection db) {
        _config = config;
        _connectionString = config.GetConnectionString("SQLServer")!;
        _db = db;

    }

    [HttpPost("signup")]
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

         
    [HttpGet("login")]
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
        var roles = _db.Query<Role>
        ("Select Nov.ROLES.ID, NOV.ROLES.Name FROM NOV.ROLES join NOV.USERS_ROLES on (NOV.ROLES.ID = NOV.USERS_ROLES.USER_ID) Where NOV.Roles.ID = @UserId"
        , param: new{UserId = user.Id});
        string token = GenerateToken(user, roles);
        await GenerateRefreshToken();
        return Ok(new { result.Name, token });
    }

    [HttpGet("refresh")]
    [Authorize]
    public async Task<IActionResult> RefreshToken()
    {
        
        var RequestToken = Request.Cookies["refreshToken"];
        Guid token;
        Guid.TryParse(RequestToken, out token);
        var param = new { token };
        var refreshToken = await _db.QueryFirstOrDefaultAsync<RefreshToken>("Select * FROM NOV.REFRESH_TOKENS WHERE TOKEN = @token", param);
        if (refreshToken is null || refreshToken.Expires < DateTime.Now)
        {
            return Unauthorized();
        }

        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var claims = jwt.Claims;
        var newToken = ConstructToken(claims.ToList());
        string newtTokenString = new JwtSecurityTokenHandler().WriteToken(newToken);
        return Ok(newtTokenString);
    }

    [HttpGet("logout")]
    [Authorize]
    public async Task<IActionResult> Logout() {
        try
        {
            await _db.ExecuteAsync("Delete From NOV.REFRESH_TOKENS WHERE TOKEN = @token", new {token = Request.Cookies["refreshToken"]});
        }
        catch (System.Exception)
        {
            return StatusCode(500, "Something went wrong");
        }
        return Ok();
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

        var token = ConstructToken(claims);
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }

    private JwtSecurityToken ConstructToken(List<Claim> claims)
    {
        var issuer = _config["JWT:Issuer"];

        var audience = _config["JWT:Audience"];

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));

        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

        var token = new JwtSecurityToken(issuer: issuer, audience: audience, claims: claims, signingCredentials: cred, expires: DateTime.Now.AddDays(1));
        return token;
    }

    private async Task GenerateRefreshToken()
    {
        var token = new RefreshToken();
        var sql = "INSERT INTO NOV.REFRESH_TOKENS (token, expires) VALUES (@token, @expires)";
        var param = new { token = token.Token, expires = token.Expires };
        await _db.ExecuteAsync(sql, param);
        var cookieOptions = new CookieOptions()
        {
            HttpOnly = true,
            Expires = token.Expires
        };
        Response.Cookies.Append("refreshToken", token.Token.ToString(), cookieOptions);
    }
}
