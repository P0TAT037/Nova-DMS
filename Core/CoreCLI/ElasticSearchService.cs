using Elasticsearch.Net;
using Microsoft.Extensions.Configuration;
using Nest;
using CoreEngine.Models;
using CoreCLI;

namespace Services;
public static class ElasticSearchService
{
    public static void AddElasticSearch(ElasticSearchClientConfig config) {
        var url = config.Url;
        var username = config.Username;
        var password = config.Password;
        var defaultIndex = config.DefaultIndex;
        var CAFingerprint = config.CAFingerprint;

        var settings = new ConnectionSettings(new SingleNodeConnectionPool(new Uri(url!)))
            .BasicAuthentication(username, password)
            .DefaultIndex(defaultIndex)
            .CertificateFingerprint(CAFingerprint)
            .EnableApiVersioningHeader()
            .PingTimeout(TimeSpan.FromSeconds(1));

        AddDefaultMapping(settings);

        var client = new ElasticClient(settings);
        
        try 
        {
            if(!client.Ping().IsValid)
                throw client.Ping().OriginalException;
        }  
        catch(Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return;
        }
        
        CreateIndex(client, defaultIndex);
                
    }

    private static void AddDefaultMapping(ConnectionSettings settings)
    {
        settings.DefaultMappingFor<Request>(p => p);
    }

    private static bool CreateIndex(ElasticClient client, string? indexName)
    {
        var res = client.Indices.Create(indexName, i=>i.Map<Request>(x=>x.AutoMap()));
        return res.IsValid;
            
    }


}
