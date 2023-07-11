using RestSharp;

namespace CoreEngine.Models;

public class Endpoint
{
    public string Name { get; set; } = null!;
    
    public Method Method { get; set; }

    public string Path { get; set; } = null!;

    public List<string>? PathParameters { get; set; }

    public List<string>? QueryParameters { get; set; }

    public List<string>? FormData { get; set; }

    public List<string>? Headers { get; set; }

    public Object? Body { get; set; }
}
