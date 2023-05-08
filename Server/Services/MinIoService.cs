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
        minioClient = minioClient == null ? _client : minioClient;
        bucketName = bucketName == null ? _bucketName : bucketName;

        PresignedPutObjectArgs args = new PresignedPutObjectArgs()
                                        .WithBucket(bucketName)
                                        .WithObject(objName)
                                        .WithExpiry(duration);

        string url = await minioClient.PresignedPutObjectAsync(args);

        return url;

    }

    public async Task<string> GetObjectURLAsync( string objName, string? bucketName= null, int duration = 60, MinioClient? minioClient = null)
    {

        minioClient = minioClient == null ? _client : minioClient;
        bucketName = bucketName == null ? _bucketName : bucketName;


        PresignedGetObjectArgs args = new PresignedGetObjectArgs()
                                        .WithBucket(bucketName)
                                        .WithObject(objName)
                                        .WithExpiry(duration);

        string url = await minioClient.PresignedGetObjectAsync(args);

        return url;
    }

    public async Task<List<byte>> GetObjectAsync( string objName, string? bucketName = null, MinioClient? minioClient = null, string? versionId = null)
    {

        minioClient = minioClient == null ? _client : minioClient;
        bucketName = bucketName == null ? _bucketName : bucketName;

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

    public async Task<string> UploadObjectAsync( string objName, string contentType, Stream obj, string? bucketName = null, int duration = 60, MinioClient? minioClient = null)
    {

        minioClient = minioClient == null ? _client : minioClient;
        bucketName = bucketName == null ? _bucketName : bucketName;

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objName)
            .WithStreamData(obj)
            .WithObjectSize(obj.Length)
            .WithContentType(contentType);
        await minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);

        StatObjectArgs args = new StatObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objName);
        
        var stat = await minioClient.StatObjectAsync(args).ConfigureAwait(false);
        return stat.VersionId;
    }


    //to be implemented

    public async static Task RemoveObjectAsync(string objName, string? bucketName = null, MinioClient? minioClient = null)
    {
        throw new NotImplementedException();
    }
}

