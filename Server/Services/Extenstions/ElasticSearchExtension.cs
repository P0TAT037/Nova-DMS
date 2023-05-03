using Elasticsearch.Net;
using Nest;
using Nova_DMS.Models;

namespace Nova_DMS.Services.Extensions;

public static class ElasticSearchExtension
{
    public static void AddElasticSearch(this IServiceCollection Services, IConfiguration config) {
        var url = config["ElasticSearch:Uri"];
        var username = config["ElasticSearch:Username"]; 
        var password = config["ElasticSearch:Password"];
        var defaultIndex = config["ElasticSearch:Index"];
        var CAFingerprint = config["ElasticSearch:Fingerprint"];

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
        
        Services.AddSingleton<IElasticClient>(client); 
        
    }

    private static void AddDefaultMapping(ConnectionSettings settings)
    {
        settings.DefaultMappingFor<Metadata>(p => p);
    }

    private static bool CreateIndex(ElasticClient client, string? indexName)
    {
        var res = client.Indices.Create(indexName, i=>i.Map<Metadata>(x=>x.AutoMap()));
        return res.IsValid;
            
    }


}
