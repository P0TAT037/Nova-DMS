﻿using System.Data;
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
            return BadRequest("Something wrong happened");
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
    //[AuthorizeAdminOrOwner]
    public async Task<IActionResult> EditPermission(int usrId, int FileId, bool? perm)
    {
        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
            if (perm == null)
            {
                db.Execute($"Delete From NOV.FILES_USERS Where USER_ID = {usrId} AND FILE_ID = {FileId}");
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
    [Route("getFileUsers")]
    //[AuthorizeAdminOrOwner]
    public async Task<IActionResult> GetFileUsers(int usrId, int FileId)
    {
        var db = new SqlConnection(config.GetConnectionString("SqlServer"));
        try
        {
          
            var result = await db.QueryAsync($"Select user_ID, PERM From NOV.FILES_USERS Where FILE_ID = {FileId}");
           
            return Ok(result);
        }
        catch (Exception e)
        {
            await Console.Out.WriteLineAsync(e.Message);
            return BadRequest("Something wrong happened");
        }
    }

}