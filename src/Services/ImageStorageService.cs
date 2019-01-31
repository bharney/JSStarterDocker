using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;

namespace StarterKit.Repository
{
    public class ImageStorageService : IImageStorageService
    {
        private readonly IConfiguration _config;

        public ImageStorageService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<string> StoreImage(string filename, byte[] image)
        {
            var filenameonly = Path.GetFileName(filename);

            var url = string.Concat(string.Format("https://{0}.blob.core.windows.net/", _config["BlobServiceAccount"]), "images/", filenameonly);

            var creds = new StorageCredentials(_config["BlobServiceAccount"], _config["BlobServiceKey"]);
            var blob = new CloudBlockBlob(new Uri(url), creds);

            bool shouldUpload = true;
            if (await blob.ExistsAsync())
            {
                await blob.FetchAttributesAsync();
                if (blob.Properties.Length == image.Length)
                {
                    shouldUpload = false;
                }
            }

            if (shouldUpload)
            {
                await blob.UploadFromByteArrayAsync(image, 0, image.Length);
            }

            return url;
        }

        public async Task<string> StoreProfile(string filename, byte[] image)
        {
            var filenameonly = Path.GetFileName(filename);

            var url = string.Concat(string.Format("https://{0}.blob.core.windows.net/", _config["BlobServiceAccount"]), "profile/", filenameonly);

            var creds = new StorageCredentials(_config["BlobServiceAccount"], _config["BlobServiceKey"]);
            var blob = new CloudBlockBlob(new Uri(url), creds);

            bool shouldUpload = true;
            if (await blob.ExistsAsync())
            {
                await blob.FetchAttributesAsync();
                if (blob.Properties.Length == image.Length)
                {
                    shouldUpload = false;
                }
            }

            if (shouldUpload)
            {
                await blob.UploadFromByteArrayAsync(image, 0, image.Length);
            }

            return url;
        }
    }
}
