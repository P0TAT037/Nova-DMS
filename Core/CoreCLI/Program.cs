using CoreEngine.Core;
using CoreEngine.Models;
using Newtonsoft.Json.Linq;
using RestSharp;


Request request = new()
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
var r = JObject.Parse(response.Content!);
Console.WriteLine(r["token"]);