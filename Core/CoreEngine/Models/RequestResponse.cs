using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreEngine.Models;

public class RequestResponse<T> where T: class
{
    Request Request { get; set; } = null!;

    T? Response { get; set; }
}
