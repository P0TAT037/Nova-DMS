using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Nova_DMS.Models;
using Nova_DMS.Models.DTOs;
using Nova_DMS.Security;
using System.ComponentModel;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Nova_DMS.Controllers;

[Route("/lists")]
[ApiController]
public class ListsController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetLists() {
        return Ok(new NotImplementedException());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateList(string name) {
        return Ok(new NotImplementedException());
    }

    [HttpPut]
    [AuthorizeNode]
    public async Task<IActionResult> AddToList(int ListId, int fileId ) {
        return Ok(new NotImplementedException());
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteList(int ListId) {
        return Ok(new NotImplementedException());
    }
}
