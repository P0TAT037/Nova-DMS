using Azure.Core;
using Minio;
using Minio.Exceptions;
using System.Net;
using System.Text;

namespace HelloWorld
{
    public static class MinIoOperations {
        private static string endpoint = "localhost:9000";
        private static string accessKey = "dms-backend";
        private static string secretKey = "backend-passwd";

        public  static string Endpoint { get => endpoint; set => endpoint = value; }
        public static string AccessKey { get => accessKey; set => accessKey = value; }
        public static string SecretKey { get => secretKey; set => secretKey = value; }
        

        public static  async  Task<string> GetUploadURLAsync( string bucketName, string objName, int duration = 60, MinioClient? minioClient = null)
        {
            minioClient = minioClient == null ? new MinioClient()
                                .WithEndpoint(Endpoint)
                                .WithCredentials(AccessKey, SecretKey)
                                .Build() : minioClient;
                
            PresignedPutObjectArgs args = new PresignedPutObjectArgs()
                                            .WithBucket(bucketName)
                                            .WithObject(objName)
                                            .WithExpiry(duration);
            
            string url = await minioClient.PresignedPutObjectAsync(args);
           
            return url;
            
        }
        
        public static  async  Task<string> GetObjectURLAsync( string bucketName, string objName, int duration = 60, MinioClient? minioClient = null)
        {
           
            minioClient = minioClient == null ? new MinioClient()
                                .WithEndpoint(Endpoint)
                                .WithCredentials(AccessKey, SecretKey)
                                .Build() : minioClient;
                
            PresignedGetObjectArgs args = new PresignedGetObjectArgs()
                                            .WithBucket(bucketName)
                                            .WithObject(objName)
                                            .WithExpiry(duration);
            
            string url = await minioClient.PresignedGetObjectAsync(args);
            
            return url;
        }
        
        public static async Task<List<byte>> GetObjectAsync( string bucketName, string objName, MinioClient? minioClient = null, string? versionId = null)
        {
            
            minioClient = minioClient == null? new MinioClient()
                                .WithEndpoint(Endpoint)
                                .WithCredentials(AccessKey, SecretKey)
                                .Build() : minioClient;
            
            
            StatObjectArgs objStats= new StatObjectArgs().WithBucket(bucketName).WithObject(objName);
            await minioClient.StatObjectAsync(objStats);

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
        
        public async static Task UploadObjectAsync(string bucketName, string objName, string contentType, byte[] obj, int duration = 60, MinioClient? minioClient = null)
        {
           
            minioClient = minioClient == null ? new MinioClient()
                .WithEndpoint(Endpoint)
                .WithCredentials(AccessKey, SecretKey)
                .Build() : minioClient;

            // Make a bucket on the server, if not already present.
            var beArgs = new BucketExistsArgs()
                .WithBucket(bucketName);
            bool found = await minioClient.BucketExistsAsync(beArgs).ConfigureAwait(false);
            if (!found)
            {
                var mbArgs = new MakeBucketArgs()
                    .WithBucket(bucketName);
                await minioClient.MakeBucketAsync(mbArgs).ConfigureAwait(false);
            }

            // Upload a file to bucket.
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objName)
                .WithRequestBody(obj)
                .WithContentType(contentType);
            await minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);

           
        }


        //to be implemented
        public async static Task GetVersionsAsync(string bucketName, string objName,  MinioClient? minioClient = null) { 
            throw new NotImplementedException();
        }
       
        public async static Task GetObjectVersionAsync(string bucketName, string objName, string VersionId, MinioClient? minioClient = null) 
        {
            throw new NotImplementedException();

        }
        
        public async static Task RemoveObjectAsync(string bucketName, string objName, MinioClient? minioClient = null) 
        {
            throw new NotImplementedException();
        }
    }
}

