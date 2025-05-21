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
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == dto.userName);
            if (user == null)
                throw new Exception("User not found");

            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userName == user.userName && ul.songId == dto.songId);

            if (entry == null)
            {
                entry = new UserLibrary
                {
                    userName = user.userName,
                    songId = dto.songId,
                    liked = dto.playlistName.ToLower() == Liked,
                    playlistName = dto.playlistName
                };
                _context.UserLibrary.Add(entry);
            }
            else
            {
                entry.playlistName = dto.playlistName;
                entry.liked = dto.playlistName.ToLower() == Liked;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<string>> GetUserPlaylistsAsync(string userName)
        {
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == userName);
            if (user == null)
                throw new Exception("User not found");

            return await _context.UserLibrary
                .Where(ul => ul.userName == user.userName && ul.playlistName != null && ul.playlistName.ToLower() != Liked)
                .Select(ul => ul.playlistName!)
                .Distinct()
                .ToListAsync();
        }

        public async Task DeletePlaylistAsync(string userName, string playlistName)
        {
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == userName);
            if (user == null)
                throw new Exception("User not found");

            var entries = await _context.UserLibrary
                .Where(ul => ul.userName == user.userName && ul.playlistName == playlistName)
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

        public async Task DeleteSongFromPlaylistAsync(string userName, decimal songId, string playlistName)
        {
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == userName);
            if (user == null)
                throw new Exception("User not found");

            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userName == user.userName && ul.songId == songId && ul.playlistName == playlistName);

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

        public async Task LikeSongAsync(string userName, decimal songId)
        {
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == userName);
            if (user == null)
                throw new Exception("User not found");

            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userName == user.userName && ul.songId == songId);

            if (entry == null)
            {
                entry = new UserLibrary
                {
                    userName = user.userName,
                    songId = songId,
                    liked = true
                };
                _context.UserLibrary.Add(entry);
            }
            else
            {
                entry.liked = true;
            }

            await _context.SaveChangesAsync();
        }

        public async Task UnlikeSongAsync(string userName, decimal songId)
        {
            var user = await _context.UserDetails.FirstOrDefaultAsync(u => u.userName == userName);
            if (user == null)
                throw new Exception("User not found");

            var entry = await _context.UserLibrary
                .FirstOrDefaultAsync(ul => ul.userName == user.userName && ul.songId == songId);

            if (entry != null)
            {
                entry.liked = false;
                await _context.SaveChangesAsync();
            }
        }
    }
}
