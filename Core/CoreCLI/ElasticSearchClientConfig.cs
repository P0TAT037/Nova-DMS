using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreCLI;

public class ElasticSearchClientConfig
{
    public string Url { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string DefaultIndex{ get; set; } = null!;
    public string CAFingerprint { get; set; } = null!;

}
