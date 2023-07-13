using RestSharp;

namespace CoreEngine.Models;
public class Request
{
    public string Name { get; set; } = null!;
    
    public Method Method { get; set; } = Method.Get;

    public string URL { get; set; } = null!;

    public string Path { get; set; } = null!;

    public Dictionary<string, string>? PathParameters { get; set; } = new Dictionary<string, string>();

    public Dictionary<string, string>? QueryParameters { get; set; } = new Dictionary<string, string>();

    public Dictionary<string, string>? FormData { get; set; } = new Dictionary<string, string>();

    public Dictionary<string, string>? Headers { get; set; } = new Dictionary<string, string>();

    public Object? Body { get; set; }

}