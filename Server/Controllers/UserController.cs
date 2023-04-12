using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Security;

namespace Nova_DMS.Controllers;

[Route("/user")]
[ApiController]
public class UserController : ControllerBase
{
    IConfiguration config;

    public UserController(IConfiguration configuration)
    {
        this.config = configuration;
    }

    [HttpPut]
    [AuthorizeAdmin]
    public async Task<IActionResult> AddRole(int usrId, int roleId)
    {

        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            db.Execute($"INSERT INTO NOV.USERS_ROLES VALUES({usrId}, {roleId})");

        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happend");
        }

        return Ok();
    }    
    
    [HttpDelete]
    [AuthorizeAdmin]
    public async Task<IActionResult> RemoveRole(int usrId, int roleId)
    {

        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            db.Execute($"Delete From NOV.USERS_ROLES Where USER_ID = {usrId} AND ROLE_ID = {roleId}");

        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happend");
        }

        return Ok();
    }


    [HttpPut]
    [AuthorizeAdmin(level:2)]
    [Route("admin")]
    public async Task<IActionResult> AssignAdmin(int usrId)
    {

        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            db.Execute($"Update NOV.USERS Set Level = 1 Where ID = {usrId}");
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happend");
        }

        return Ok();
    }
    
    [HttpDelete]
    [AuthorizeAdmin(level:2)]
    [Route("admin")]
    public async Task<IActionResult> RemoveAdmin(int usrId)
    {

        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            db.Execute($"Update NOV.USERS Set Level = 0 Where ID = {usrId}");
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happend");
        }

        return Ok();
    }
}
