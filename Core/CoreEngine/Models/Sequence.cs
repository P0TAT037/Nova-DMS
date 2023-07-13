using RestSharp;

namespace CoreEngine.Models;
public class Sequence
{
    public string Name { get; set; } = null!;
    
    public List<Endpoint> Endpoints { get; set; } = new List<Endpoint>();

    public List<string>? Responses { get; set; }

    // <Request number ,<Response number, <parameter type number, <attribute, value>>>>
    public Dictionary<int, Dictionary<int, Dictionary<int,Dictionary<string, string>>>>? Pipe { get; set; } = new Dictionary<int, Dictionary<int, Dictionary<int, Dictionary<string, string>>>>();

    // <Request Number, obj>>
    public Dictionary<int, Object>? BodyPipe { get; set; } = new Dictionary<int, Object>();

}