using System.Linq;
using Azure.Core;
using Minio;
using Minio.Exceptions;
using System.Net;
using System.Text;

namespace Nova_DMS.Services;

public class MinIoService : IObjStorageService
{
    private MinioClient _client;
    private string _bucketName;

    public MinIoService(MinioClient client, string bucketName)
    {
        _client = client;
        _bucketName = bucketName;
    }

    public async Task<string> GetUploadURLAsync( string objName, string? bucketName = null, int duration = 60, MinioClient? minioClient = null)
    {
        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;

        PresignedPutObjectArgs args = new PresignedPutObjectArgs()
                                        .WithBucket(bucketName)
                                        .WithObject(objName)
                                        .WithExpiry(duration);

        string url = await minioClient.PresignedPutObjectAsync(args);

        return url;

    }

    public async Task<string> GetObjectURLAsync( string objName, string? bucketName= null, int duration = 60, MinioClient? minioClient = null)
    {

        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;


        PresignedGetObjectArgs args = new PresignedGetObjectArgs()
                                        .WithBucket(bucketName)
                                        .WithObject(objName)
                                        .WithExpiry(duration);

        string url = await minioClient.PresignedGetObjectAsync(args);

        return url;
    }

    public async Task<List<byte>> GetObjectAsync( string objName, string? bucketName = null, MinioClient? minioClient = null, string? versionId = null)
    {

        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;

        List<byte> data = new List<byte>();
        GetObjectArgs args = new GetObjectArgs()
                                    .WithBucket(bucketName)
                                    .WithObject(objName)
                                    .WithCallbackStream((stream) =>
                                    {
                                        using (StreamReader sr = new StreamReader(stream))
                                        {
                                            data = Encoding.ASCII.GetBytes(sr.ReadToEnd()).ToList();
                                        }

                                    });
        if (versionId != null)
        {
            args = args.WithVersionId(versionId);
        }

        await minioClient.GetObjectAsync(args);
        return data;
    }

    public async Task UploadObjectAsync( string objName, string contentType, Stream obj, string? bucketName = null, int duration = 60, MinioClient? minioClient = null)
    {

        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objName)
            .WithStreamData(obj)
            .WithObjectSize(obj.Length)
            .WithContentType(contentType);
        await minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
        
    }

    public List<string> GetVersions(string objName, string? bucketName = null, MinioClient? minioClient = null)
    {
        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;

        var versions = new List<string>();

        var args = new ListObjectsArgs()
            .WithBucket(bucketName)
            .WithPrefix(objName)
            .WithVersions(true);


        var observable = minioClient.ListObjectsAsync(args);    
        var StatObjectAsyncArgs = new StatObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objName);         

        bool isComplete = false;
        var sub = observable.Subscribe(
            onNext: item => versions.Add(item.VersionId),
            onCompleted: () => {isComplete = true;},
            onError: ex => Console.WriteLine(ex));
        
        //wait for the observable to complete
        while (!isComplete){} 

        sub.Dispose();

        return versions;
    }

    public async Task RemoveObjectAsync(string objName, string? bucketName = null, MinioClient? minioClient = null, string? versionId = null)
    {
        minioClient = minioClient ?? _client;
        bucketName = bucketName ?? _bucketName;

        var args = new RemoveObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objName);

        if(versionId != null)
        {
            args = args.WithVersionId(versionId);
        }
        await minioClient.RemoveObjectAsync(args);
    }
}

