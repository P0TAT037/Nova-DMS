using Elasticsearch.Net;
using Nest;
using CoreEngine.Models;

namespace CoreEngine.Services;
public static class ElasticSearchService
{
    public static ElasticClient InitElasticSearch(ElasticSearchClientConfig config) {
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
        
  
        if(!client.Ping().IsValid)
            throw client.Ping().OriginalException;
        

        
        CreateIndex<Request>(client, "requests");
        CreateIndex<Endpoint>(client, "endpoints");

        return client;
                
    }

    private static void AddDefaultMapping(ConnectionSettings settings)
    {
        settings.DefaultMappingFor<Request>(p => p);
        settings.DefaultMappingFor<Endpoint>(p => p);
        settings.DefaultMappingFor<Sequence>(p => p);
    }

    private static bool CreateIndex<T>(ElasticClient client, string? indexName) where T : class
    {
        var res = client.Indices.Create(indexName, i => i.Map<T> (x => x.AutoMap()));
        return res.IsValid;
            
    }


}
