using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Minio;

namespace Nova_DMS.Services.Extensions;

public static class MinIOExtension
{
    public static void AddObjStorage(this IServiceCollection services, IConfiguration config){
        var url = config["MinIO:Endpoint"];
        var accessKey = config["MinIO:AccessKey"];
        var secretKey = config["MinIO:SecretKey"];
        var bucketName = config["MinIO:BucketName"];
        
        var minioClient = new MinioClient().WithEndpoint(url)
                                           .WithCredentials(accessKey, secretKey)
                                           .Build();
        
        CheckCreateBucket(bucketName, minioClient).Wait();

        var minIoService = new MinIoService(minioClient, bucketName!);
        
        services.AddSingleton<IObjStorageService>(minIoService);
    }

    private static async Task CheckCreateBucket(string? bucketName, MinioClient? minioClient)
        {
            var beArgs = new BucketExistsArgs()
                        .WithBucket(bucketName);
            bool found = await minioClient!.BucketExistsAsync(beArgs);
            if (!found)
            {
                var mbArgs = new MakeBucketArgs()
                    .WithBucket(bucketName);
                await minioClient.MakeBucketAsync(mbArgs).ConfigureAwait(false);
            }
        }
    
}
