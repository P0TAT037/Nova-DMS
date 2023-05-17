using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Models;

public class SearchResult
{
    public long hits { get; set; }
    public IEnumerable<Node>? results { get; set; }
}
