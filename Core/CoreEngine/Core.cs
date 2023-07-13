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

        await ElasticClient.DeleteAsync<Sequence>(id);
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
    
    public static void ExecuteSequence(Sequence s) {
        InitGaurd();

        for (int i = 0; i < s.Endpoints.Count; i++) {
            var Request = new Request{
                URL = s.Endpoints[i].URL,
                Path = s.Endpoints[i].Path,
                Method = s.Endpoints[i].Method,
            };
            
            Request.Body = s.BodyPipe![i];

            for (int j = 0; j< s.Endpoints[i].PathParameters!.Count; j++)
            {
                var paramName = s.Endpoints[i].PathParameters![j];
                var paramValue = s.Pipe![i][0][j][paramName];
                Request.PathParameters!.Add(paramName, paramValue);
            }

            for (int j = 0; j< s.Endpoints[i].QueryParameters!.Count; j++)
            {
                var paramName = s.Endpoints[i].QueryParameters![j];
                var paramValue = s.Pipe![i][1][j][paramName];
                Request.QueryParameters!.Add(paramName, paramValue);
            }

            for (int j = 0; j< s.Endpoints[i].FormData!.Count; j++)
            {
                var paramName = s.Endpoints[i].FormData![j];
                var paramValue = s.Pipe![i][2][j][paramName];
                Request.FormData!.Add(paramName, paramValue);
            }

            for (int j = 0; j< s.Endpoints[i].Headers!.Count; j++)
            {
                var paramName = s.Endpoints[i].Headers![j];
                var paramValue = s.Pipe![i][3][j][paramName];
                Request.Headers!.Add(paramName, paramValue);
            }

            var response = SendRequest(Request).Result;

            s.Responses!.Add(response.Content!);

        };
            
            /* code to pipe responses to request[i+1] on custom user conditions */
    }
    
    private static void InitGaurd()
    {
        if (!initialized) throw new Exception("Core is not initialized, you need to call Core.Init() first");
    }
}
