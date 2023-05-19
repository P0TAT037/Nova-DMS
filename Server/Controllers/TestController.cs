using Microsoft.AspNetCore.Mvc;
using Nova_DMS.Services;

namespace Nova_DMS.Controllers;

[Route("/test")]
[ApiController]
public class TestController : ControllerBase
{
    IObjStorageService _minioService;

    public TestController(IObjStorageService minioService)
    {
        _minioService = minioService;
    }


    [HttpGet]
    public IActionResult Test(string name)
    {
        return Ok(_minioService.GetVersions(name));
    }
}
