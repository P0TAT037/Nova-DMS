using RestSharp;

namespace CoreEngine.Models;
public class Request
{
    public string Name { get; set; } = null!;
    
    public Method Method { get; set; }

    public string URL { get; set; } = null!;

    public string Path { get; set; } = null!;

    public Dictionary<string, string>? PathParameters { get; set; }

    public Dictionary<string, string>? QueryParameters { get; set; }

    public Dictionary<string, string>? FormData { get; set; }

    public Dictionary<string, string>? Headers { get; set; }

    public Object? Body { get; set; }

}