using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nova_DMS.Services.Extensions;

public static class MinIOExtension
{
    public static void AddObjStorage(this IServiceCollection services, IConfiguration config){
        var url = config["MinIO:Endpoint"];
        var accessKey = config["MinIO:AccessKey"];
        var secretKey = config["MinIO:SecretKey"];
        var bucketName = config["MinIO:BucketName"];
        
        var minIoService = new MinIoService(url!, accessKey!, secretKey!, bucketName!);
         
        services.AddSingleton<IObjStorageService>(minIoService);
    }
    
}
