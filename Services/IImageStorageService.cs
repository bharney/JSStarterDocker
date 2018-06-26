using System.Threading.Tasks;

namespace StarterKit.Repository
{
    public interface IImageStorageService
    {
        Task<string> StoreImage(string filename, byte[] image);
        Task<string> StoreProfile(string filename, byte[] image);
    }
}
