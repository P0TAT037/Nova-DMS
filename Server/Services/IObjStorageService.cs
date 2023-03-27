using Minio;

namespace Nova_DMS.Services
{
    public interface IObjStorageService
    {
        public Task<string> GetUploadURLAsync(string objName, string? bucketName = null, int duration = 60, MinioClient? minioClient = null);
        public Task<string> GetObjectURLAsync(string objName, string? bucketName = null, int duration = 60, MinioClient? minioClient = null);
        public Task UploadObjectAsync(string objName, string contentType, Stream obj, string? bucketName = null, int duration = 60, MinioClient? minioClient = null);    
    }
}