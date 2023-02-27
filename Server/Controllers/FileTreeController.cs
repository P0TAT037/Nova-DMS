﻿using Microsoft.AspNetCore.Mvc;
using Nova_DMS.Models;

namespace Nova_DMS.Controllers
{
    [Route("/getTree")]
    [ApiController]
    public class FileTreeController : Controller
    {
        [HttpGet]
        public List<Obj> Get()
        {
            return new List<Obj>();
        }
    }
}
