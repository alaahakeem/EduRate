using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace EduRate.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folderName);
        void DeleteFile(string fileUrl);
    }
}
