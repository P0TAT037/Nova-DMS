using System.IdentityModel.Tokens.Jwt;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Nest;
using Nova_DMS.Models;

namespace Nova_DMS.Controllers;

[Route("/search")]
[ApiController]
public class SearchController : ControllerBase
{
    IElasticClient _elasticClient;
    SqlConnection _db = null!;

    public SearchController(IElasticClient elasticClient, SqlConnection db) {
        _elasticClient = elasticClient;
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Search(string searchText, int page = 0)
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        
        var fileIds = await _db.QueryAsync<int>("Select Files_Users.File_Id from Nov.Files_Users where Nov.Files_Users.UserId = @UserId", new { UserId }).ConfigureAwait(false);
        
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
                        .Field(f=>f.Name)
                        .Field(f=>f.Description)
                        .Field(f=>f.Content)
                        .Field(f=>f.Author)
                        .Field(f=>f.EditedBy)
                        ))
                    )
            )
        )
        .From(page*10)
        .Size(10));
        return Ok(new { hits= searchResult.Total, Results = searchResult.Documents });
    }
}
