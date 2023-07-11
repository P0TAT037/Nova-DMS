using CoreEngine.Core;
using CoreEngine.Models;
using Microsoft.Extensions.Configuration;
using RestSharp;

class Program
{
    static async Task Main(string[] args)
    {

        Request request = new Request() 
            {
                Method = Method.Get,
                URL = "https://localhost:7052", 
                Path = "/auth/login", 
                QueryParameters = new Dictionary<string, string>()
                {
                    {"username", "admin"},
                    {"password", "admin"}
                }
            };

        var response = await Core.SendRequest(request);

        Console.WriteLine(response.Content);
    }
}