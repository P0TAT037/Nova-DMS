using System.Data;
using System.Transactions;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using Nova_DMS.Security;

namespace Nova_DMS.Controllers;

[Route("/user")]
[ApiController]
public class UserController : ControllerBase
{
    IConfiguration config;
    SqlConnection db;

    public UserController(IConfiguration configuration, SqlConnection connection)
    {
        this.config = configuration;
        this.db = connection;
    }

    [HttpPut]
    [AuthorizeAdmin]
    public async Task<IActionResult> AddRole(int usrId, int roleId)
    {
        try
        {
            db.Execute($"INSERT INTO NOV.USERS_ROLES VALUES(@usrId, @roleId)", new {usrId, roleId});

        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }

        return Ok();
    }    
    
    [HttpDelete]
    [AuthorizeAdmin]
    public async Task<IActionResult> RemoveRole(int usrId, int roleId)
    {

        try
        {
            db.Execute($"Delete From NOV.USERS_ROLES Where USER_ID = @usrId AND ROLE_ID = @roleId", new {usrId, roleId});

        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }

        return Ok();
    }


    [HttpPut]
    [AuthorizeAdmin(level:2)]
    [Route("admin")]
    public async Task<IActionResult> AssignAdmin(int usrId)
    {
        try
        {
            db.Execute($"Update NOV.USERS Set Level = 1 Where ID = @usrId", new {usrId});
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }

        return Ok();
    }
    
    [HttpDelete]
    [AuthorizeAdmin(level:2)]
    [Route("admin")]
    public async Task<IActionResult> RemoveAdmin(int usrId)
    {
        try
        {
            db.Execute($"Update NOV.USERS Set Level = 0 Where ID = @usrId", new {usrId});
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }

        return Ok();
    }

    [HttpGet]
    [Route("admin")]
    public async Task<IActionResult> GetAdmins(int usrId)
    {

        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            return Ok(await db.QueryAsync<User>($"Select ID, Username, Name, Level From NOV.USERS Where Level > 0"));
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }

    [HttpGet]
    [Route("changeperm")]
    [AuthorizeAdminOrOwner]
    public async Task<IActionResult> EditPermission(int usrId, int FileId, bool? perm)
    {
        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            if (perm == null)
            {
                db.Execute($"Delete From NOV.FILES_USERS Where USER_ID = @usrId AND FILE_ID = @FileId", new {usrId, FileId});
            }
            else
            {
                db.Execute($"ChangePerm", new { usrId, FileId, perm }, commandType: CommandType.StoredProcedure);
            }
            return Ok();
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }

    [HttpGet]
    [Route("changeperm/{roleId}")]
    [AuthorizeAdminOrOwner]
    public async Task<IActionResult> EditRolePermission(int RoleId, int FileId, bool? perm)
    {
        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            await db.ExecuteAsync($"ChangePermByRole", new {RoleId, FileId, perm}, commandType: CommandType.StoredProcedure);
            return Ok();
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }

    [HttpGet]
    [Route("getFileUsers")]
    [AuthorizeAdminOrOwner]
    public async Task<IActionResult> GetFileUsers(int FileId)
    {
        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            var result = await db.QueryAsync($"Select user_ID, PERM as perm From NOV.FILES_USERS Where FILE_ID = @FileId", new {FileId});
           
            return Ok(result);
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }


    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var result = await db.QueryAsync<User>($"Select ID, Username, Name, Level From NOV.USERS");
            return Ok(result);
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }

    [HttpDelete]
    [Route("delete")]
    [AuthorizeAdmin(level:2)]
    public async Task<IActionResult> DeleteUser(int usrId)
    {
        try
        {
            using (var transactionScope = new TransactionScope())
            {
                db.Execute($"Delete From NOV.FILES_USERS Where USER_ID = @usrId", new {usrId});
                db.Execute($"Delete From NOV.USERS_ROLES Where USER_ID = @usrId", new {usrId});
                db.Execute($"Delete From NOV.FILES_OWNERS Where UserID = @usrId", new {usrId});
                db.Execute($"Delete From NOV.USERS Where ID = @usrId", new {usrId});
            }
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return StatusCode(500,"Something wrong happened");
        }

        return Ok();
    }
}
