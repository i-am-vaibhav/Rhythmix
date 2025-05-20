using Microsoft.EntityFrameworkCore;
using rhythmix_user_services.Data;
using rhythmix_user_services.DTOs;
using rhythmix_user_services.Models;

namespace rhythmix_user_services.Services
{
    public class PlaylistService : IPlaylistService
    {
        private readonly AppDbContext _context;
        private const string Liked = "liked";

        public PlaylistService(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddSongToPlaylistAsync(AddToPlaylistDto dto)
        {
            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userId == dto.userId && ul.songId == dto.songId);

            if (entry == null)
            {
                entry = new UserLibrary
                {
                    userId = dto.userId,
                    songId = dto.songId,
                    liked = dto.PlaylistName.ToLower() == Liked,
                    playlistName = dto.PlaylistName
                };
                _context.UserLibrary.Add(entry);
            }
            else
            {
                entry.playlistName = dto.PlaylistName;
                entry.liked = dto.PlaylistName.ToLower() == Liked;
            }
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<string>> GetUserPlaylistsAsync(Guid userId)
        {
            return await _context.UserLibrary
                .Where(ul => ul.userId == userId && ul.playlistName != null && ul.playlistName != Liked)
                .Select(ul => ul.playlistName!)
                .Distinct()
                .ToListAsync();
        }

        public async Task DeletePlaylistAsync(Guid userId, string playlistName)
        {
            var entries = await _context.UserLibrary
                .Where(ul => ul.userId == userId && ul.playlistName == playlistName)
                .ToListAsync();

            foreach (var entry in entries)
            {
                if (playlistName.ToLower() == Liked)
                {
                    entry.playlistName = null;
                }
                else
                {
                    _context.UserLibrary.Remove(entry);
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSongFromPlaylistAsync(Guid userId, decimal songId, string playlistName)
        {
            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userId == userId && ul.songId == songId && ul.playlistName == playlistName);

            if (entry != null)
            {
                if (playlistName.ToLower() == Liked)
                {
                    entry.playlistName = null;
                }
                else
                {
                    _context.UserLibrary.Remove(entry);
                }
                await _context.SaveChangesAsync();
            }
        }
    }
}
