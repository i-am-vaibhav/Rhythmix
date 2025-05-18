using rhythmix_user_services.DTOs;
using rhythmix_user_services.Models;
namespace rhythmix_user_services.Services
{
    public interface IUserService
    {
        Task<UserDetails> CreateUserAsync(CreateUserDto dto);
        Task<UserDetails?> GetUserAsync(string value);
    }
}
