using Microsoft.AspNetCore.Mvc;
using rhythmix_user_services.DTOs;
using rhythmix_user_services.Services;

namespace rhythmix_user_services.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistService _playlistService;

        public PlaylistController(IPlaylistService playlistService)
        {
            _playlistService = playlistService;
        }

        [HttpPost("add-song")]
        public async Task<IActionResult> AddSongToPlaylist([FromBody] AddToPlaylistDto dto)
        {
            await _playlistService.AddSongToPlaylistAsync(dto);
            return Ok();
        }

        [HttpGet("{userId}/playlists")]
        public async Task<IActionResult> GetPlaylists(Guid userId)
        {
            var playlists = await _playlistService.GetUserPlaylistsAsync(userId);
            return Ok(playlists);
        }

        [HttpDelete("{userId}/playlist/{playlistName}")]
        public async Task<IActionResult> DeletePlaylist(Guid userId, string playlistName)
        {
            await _playlistService.DeletePlaylistAsync(userId, playlistName);
            return NoContent();
        }

        [HttpDelete("{userId}/playlist/{playlistName}/song/{songId}")]
        public async Task<IActionResult> DeleteSongFromPlaylist(Guid userId, string playlistName, decimal songId)
        {
            await _playlistService.DeleteSongFromPlaylistAsync(userId, songId, playlistName);
            return NoContent();
        }
    }
}

