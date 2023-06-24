using RestSharp;
using Nest;
using CoreEngine.Models;
using CoreEngine.Services;

namespace CoreEngine.Core;

public class Core
{
    private static bool initialized = false;

    public static ElasticClient ElasticClient { get; set; } = null!;

    public static void Init(ElasticSearchClientConfig elasticSearchClientConfig)
    {
        ElasticClient = ElasticSearchService.InitElasticSearch(elasticSearchClientConfig);

        initialized = true;
    }

    public static void RegisterEndpoint(Endpoint e) {
        InitGaurd();

        ElasticClient.IndexDocument(e);
    }
    
    public async static Task<Endpoint> GetEndpoint(int id) {
        InitGaurd();

        var sourceResponse = await ElasticClient.SourceAsync<Endpoint>(id);

        return sourceResponse.Body;
    }
    
    public async static void UnregisterEndpoint(int id) {
        InitGaurd();

        await ElasticClient.DeleteAsync<Endpoint>(id);
    }
    
    
    public static void RegisterRequest(Request r) {
        InitGaurd();

        ElasticClient.IndexDocument(r);
    }

    public async static Task<Request> GetRequest(int id) {
        InitGaurd();

        var sourceResponse = await ElasticClient.SourceAsync<Request>(id);

        return sourceResponse.Body;
    }

    public async static void UnregisterRequest(int id) {
        InitGaurd();

        await ElasticClient.DeleteAsync<Request>(id);
    }


    public static void CreatSequence<T>() { }

    public static void RegisterSequence() { }

    public static void GetSequence() { }

    public static void UnregisterSequence() { }
    

    public async static Task<RestResponse> SendRequest(Request r) {
        var RestClientOptions = new RestClientOptions() { MaxTimeout = 300000, BaseUrl = new Uri(r.URL) };
        var client = new RestClient(RestClientOptions);
        var request = new RestRequest(r.Path);

        if (r.QueryParameters != null) {
            foreach (var param in r.QueryParameters)
            {
                request.AddQueryParameter(param.Key, param.Value);
            }
        }

        if (r.PathParameters != null) {
            foreach (var param in r.PathParameters)
            {
                request.AddUrlSegment(param.Key, param.Value);
            }
        }

        if (r.FormData != null) {
            foreach (var param in r.FormData)
            {
                request.AddParameter(param.Key, param.Value);
            }
        }

        if (r.Headers != null) {
            foreach (var param in r.Headers)
            {
                request.AddHeader(param.Key, param.Value);
            }
        }

        if (r.Body != null)
            request.AddBody(r.Body!);

        RestResponse response = await client.ExecuteAsync(request, r.Method);

        return response;
    }
    
    public static void ExecuteSequence(List<RequestResponse<dynamic>> requests) {
        InitGaurd();

        for (int i = 0; i < requests.Count; i++) {
            requests[i].Response = SendRequest(requests[i].Request);
            
            /* code to pipe responses to request[i+1] on custom user conditions */
        }
    }
    
    private static void InitGaurd()
    {
        if (!initialized) throw new Exception("Core is not initialized, you need to call Core.Init() first");
    }
}
