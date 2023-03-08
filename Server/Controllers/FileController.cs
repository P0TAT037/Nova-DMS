using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nova_DMS.Services;

namespace Nova_DMS.Controllers;

[Route("api/file/{name}")]
[ApiController]
public class FileController : Controller
{
    IMinIoService minIoService;

    public FileController(IMinIoService ms) { 
        minIoService= ms;
    }

    [HttpGet]
    //[Authorize]
    public async Task<string> GetFileAsync(string name)
    {
        return await minIoService.GetObjectURLAsync(name);
    }

    [HttpPost]
    public async Task UploadFile(string name, string ContentType, IFormFile file)
    {
        var fs = file.OpenReadStream();
        
        await minIoService.UploadObjectAsync(name, ContentType, fs);
                
        //TODO:
        // - Add file to the sql db
        // - Add file metadata to ElasticSearch db
        // - return file id if the process is successfull else return -1
    }
}
