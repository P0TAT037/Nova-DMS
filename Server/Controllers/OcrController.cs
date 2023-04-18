using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Nova_DMS.Controllers;

[Route("/getText")]
[ApiController]
public class OcrController
{

    [HttpGet]
    public async Task<IActionResult> GetTextAsync()
    {
        throw new NotImplementedException();
    }
}