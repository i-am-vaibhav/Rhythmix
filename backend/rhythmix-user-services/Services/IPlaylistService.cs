using rhythmix_user_services.DTOs;
using rhythmix_user_services.Models;

namespace rhythmix_user_services.Services
{
    public interface IPlaylistService
    {
        Task AddSongToPlaylistAsync(AddToPlaylistDto dto);
        Task<IEnumerable<string>> GetUserPlaylistsAsync(string userName);
        Task DeletePlaylistAsync(string userName, string playlistName);
        Task DeleteSongFromPlaylistAsync(string userName, decimal songId, string playlistName);

        Task LikeSongAsync(string userName, decimal songId);
        Task UnlikeSongAsync(string userName, decimal songId);
    }
}