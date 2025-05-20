using rhythmix_user_services.DTOs;
using rhythmix_user_services.Models;

namespace rhythmix_user_services.Services
{
    public interface IPlaylistService
    {
        Task AddSongToPlaylistAsync(AddToPlaylistDto dto);
        Task<IEnumerable<string>> GetUserPlaylistsAsync(Guid userId);
        Task DeletePlaylistAsync(Guid userId, string playlistName);
        Task DeleteSongFromPlaylistAsync(Guid userId, decimal songId, string playlistName);
    }
}
