using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nova_DMS.Models;
using Nova_DMS.Models.DTOs;
using Nova_DMS.Security;

namespace Nova_DMS.Controllers;

[Route("/role")]
[ApiController]
public class RoleController : ControllerBase
{
    IConfiguration _config;

    public RoleController(IConfiguration config)
    {
        _config = config;
    }


    [HttpPost]
    [AuthorizeAdmin]
    public async Task<IActionResult> AddRole(string name)
    {
        var db = new SqlConnection(_config.GetConnectionString("SQLServer"));
        try
        {
            await db.ExecuteAsync("INSERT INTO nov.Roles (Name) VALUES (@name)", new { name });

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
    public async Task<IActionResult> DeleteRole(string name)
    {
        var db = new SqlConnection(_config.GetConnectionString("SQLServer"));
        try
        {
            await db.ExecuteAsync("Delete from nov.Roles where name = @name", new { name });

        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);

            return BadRequest("Something wrong happend");
        }
        
        return Ok();
    }
    

    [HttpGet]
    [AuthorizeAdmin]
    public async Task<IActionResult> GetRoles()
    {
        var db = new SqlConnection(_config.GetConnectionString("SQLServer"));
        
        try
        {
            var roles = await db.QueryAsync<Role>("SELECT * FROM nov.Roles");
            var sql = "SELECT ID, USERNAME, NAME ,[LEVEL], ROLE_ID FROM nov.Users join nov.USERS_ROLES on nov.USERs.ID = nov.USERS_ROLES.USER_ID";
            var users=  await db.QueryAsync<UserWithRoleDTO>(sql);
              
            for(int i = 0; i < roles.Count(); i++) 
            { 
                roles.ElementAt(i).users = users.Where(x=>x.RoleId== roles.ElementAt(i).Id).ToList();
            } 

            return Ok(roles);
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);

            return BadRequest("Something wrong happened");
        }
    }
}
