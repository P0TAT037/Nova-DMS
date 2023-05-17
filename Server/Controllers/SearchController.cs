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

    IElasticClient _elasticClient;
    SqlConnection _db = null!;
    
    public SearchController(IElasticClient elasticClient, SqlConnection db) {
        _elasticClient = elasticClient;
        _db = db;
        string[] fields = {"", "", };
    }


    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Search(string searchText, List<string>? fields = null)
    {
        if (fields == null)
        {
            fields = new List<string>(){"name", "description", "content"};
        }
        var jwt = new JwtSecurityToken(Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        
        var fileIds = await _db.QueryAsync<int>("Select Files_Users.File_Id from Nov.Files_Users where Nov.Files_Users.User_Id = @UserId", new { UserId }).ConfigureAwait(false);

        var searchResult = await _elasticClient.SearchAsync<Metadata>(s => s
        .Query(q => q
            .Bool(b => b
                .Must(m => m
                        .Ids(ids => ids
                            .Values(fileIds.Select(f => f.ToString()))
                        ),
                        m => 
                        m.MultiMatch(m => m
                            .Fields(fields.ToArray())
                            .Query(searchText)
                        )
                    )
            )
        ));
        
        List<Node> results = new List<Node>();
        foreach (var metadata in searchResult.Documents)
        {
            results.Add(new Node { Id = metadata.Id.ToString(), Name = metadata.Name, HID = await GetHid(metadata.Id), Metadata = metadata });
        }
        return Ok(new SearchResult { hits = searchResult.Total, results = results });
    }

    private async Task<string> GetHid(int id)
    {
        return await _db.QueryFirstAsync<string>("Select DIR from Nov.Files where Id = @id", new { id }).ConfigureAwait(false) ;
    }

    [HttpPost]
    [Route("filter")]
    [Authorize]
    public async Task<ActionResult> Filter(Dictionary<string, string> searchFields)
    {

        var Query = await BuildQuery(searchFields);

        var resultsMetadata = await _elasticClient.SearchAsync<Metadata>(s => s.Query(q=>q.Bool(b=>Query)));

        List<Node> results = new List<Node>();
        foreach (var metadata in resultsMetadata.Documents)
        {
            results.Add(new Node { Id = metadata.Id.ToString(), Name = metadata.Name, HID = await GetHid(metadata.Id), Metadata = metadata });
        }
        return Ok(new SearchResult { hits = resultsMetadata.Total, results = results });
    }

    private async Task<BoolQueryDescriptor<Metadata>> BuildQuery([FromBody] Dictionary<string, string> searchFields)
    {
        var jwt = new JwtSecurityToken(HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1]);
        var UserId = int.Parse(jwt.Claims.First(c => c.Type == "id").Value);
        
        var fileIds = await _db.QueryAsync<int>("Select Files_Users.File_Id from Nov.Files_Users where Nov.Files_Users.User_Id = @UserId", new { UserId }).ConfigureAwait(false);

        var boolQueryDescriptor = new BoolQueryDescriptor<Metadata>();
        boolQueryDescriptor.Must(m => m.Ids(ids => ids.Values(fileIds.Select(f => f.ToString()))));


        foreach (var searchField in searchFields)
        {
            boolQueryDescriptor.Must(m => m.Match(match => match
                .Field(searchField.Key)
                .Query(searchField.Value)
            ));
        }

        return boolQueryDescriptor;
    }
}
