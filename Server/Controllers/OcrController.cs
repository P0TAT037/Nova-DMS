using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Nest;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net.Http.Headers;

namespace Nova_DMS.Controllers;

[Route("/getText")]
[ApiController]
public class OcrController: ControllerBase
{
    private static readonly HttpClient client = new();
    private readonly IConfiguration _config;

    public OcrController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> GetTextAsync(IFormFile image)
    {
        try{
            using (var ms = new MemoryStream())
            {
                image.CopyTo(ms);
                var imageBytes = ms.ToArray();
                ByteArrayContent content = new(imageBytes);
                content.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                MultipartFormDataContent formData = new()
                {
                    { content, "img", "image.jpg" }
                };
                // MultipartFormDataContent fromDataContent = new MultipartFormDataContent
                // {
                //     { new ByteArrayContent(fileBytes), "img" }
                // };

                // var base64String = Convert.ToBase64String(fileBytes);
                var result = await client.PostAsync(_config["OCR:Uri"]+_config["OCR:GetText"], formData);
                return Ok(result.Content.ReadAsStringAsync().Result);
            }
            
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return StatusCode(500, ex.Message);
        }
        
    }

    [HttpPost]
    [Route("enhance")]
    public async Task<IActionResult> EnhanceImageAsync(IFormFile image)
    {
        try{
            using (var ms = new MemoryStream())
            {
                image.CopyTo(ms);
                var imageBytes = ms.ToArray();
                ByteArrayContent content = new(imageBytes);
                content.Headers.ContentType = new MediaTypeHeaderValue(image.ContentType);
                MultipartFormDataContent formData = new()
                {
                    { content, "img", "image.jpg" }
                };
                // MultipartFormDataContent fromDataContent = new MultipartFormDataContent
                // {
                //     { new ByteArrayContent(fileBytes), "img" }
                // };

                // var base64String = Convert.ToBase64String(fileBytes);
                var result = await client.PostAsync(_config["OCR:Uri"]+_config["OCR:EnhanceImage"], formData);
                return Ok(result.Content.ReadAsByteArrayAsync().Result);
            }
            
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return StatusCode(500, ex.Message);
        }
        
    }
}