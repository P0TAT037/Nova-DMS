using System.IdentityModel.Tokens.Jwt;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nest;
using Nova_DMS.Models;
using Nova_DMS.Models.DTOs;

namespace Nova_DMS.Controllers;

[Route("/search")]
[ApiController]
public class SearchController : ControllerBase
{

    [Flags]
    public enum Fields
    {
        None = 0,
        Name = 1,
        Type = 2,
        Description = 4,
        Content = 8,
        Author = 16,
        EditedBy = 32,
        Created = 64,
        Updated = 128,
    }

    IElasticClient _elasticClient;
    SqlConnection _db = null!;
    
    public SearchController(IElasticClient elasticClient, SqlConnection db) {
        _elasticClient = elasticClient;
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Search(string searchText, int page = 0, Fields setFields = Fields.Name )
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        
        var fileIds = await _db.QueryAsync<int>("Select Files_Users.File_Id from Nov.Files_Users where Nov.Files_Users.User_Id = @UserId", new { UserId }).ConfigureAwait(false);
        
        

        var searchFieldsNames = Enum.GetNames(typeof(Fields))
            .Where(name => setFields.HasFlag((Fields)Enum.Parse(typeof(Fields), name)))
            .ToArray();


        var searchResult = await _elasticClient.SearchAsync<Metadata>(s => s
        .Query(q => q
            .Bool(b => b
                .Must(m => m
                        .Ids(ids => ids
                            .Values(fileIds.Select(f => f.ToString()))
                    ),
                    m => 
                    m.MultiMatch(m=>m
                    .Fields(f=>f
                        .Fields(searchFieldsNames))
                        .Query(searchText)
                        )
                    )
            )
        )
        .From(page*10)
        .Size(10));
        return Ok(new { hits= searchResult.Total, Results = searchResult.Documents });
    }
}
