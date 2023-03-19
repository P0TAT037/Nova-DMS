using Microsoft.AspNetCore.Mvc;
using Nest;
using Nova_DMS.Models;

namespace Nova_DMS.Controllers;

[Route("api/search")]
[ApiController]
public class SearchController : ControllerBase
{
    IElasticClient _elasticClient;

    public SearchController(IElasticClient elasticClient) {
        _elasticClient = elasticClient;
    }

    [HttpGet]
    public async Task<IActionResult> Search(string searchtext, int page = 0)
    {
        //ToDo:
        //- search only in given ids
        var searchResult = await _elasticClient.SearchAsync<Metadata>(s => s.Query(
            q => q.QueryString(
                t=>t.Query("*"+searchtext+"*")
                )
            ).From(page*10)
            .Size(10)
        );
        return Ok(new { hits= searchResult.Total, Results = searchResult.Documents });
    }
}
