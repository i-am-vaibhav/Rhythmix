using Microsoft.AspNetCore.Mvc;
using rhythmix_user_services.DTOs;
using rhythmix_user_services.Services;

namespace rhythmix_user_services.Controllers
{
    [ApiController]
    [Route("users")]
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

        [HttpGet("{userName}/collections")]
        public async Task<IActionResult> GetPlaylists(string userName)
        {
            var playlists = await _playlistService.GetUserPlaylistsAsync(userName);
            return Ok(playlists);
        }

        [HttpDelete("{userName}/collections/{playlistName}")]
        public async Task<IActionResult> DeletePlaylist(string userName, string playlistName)
        {
            await _playlistService.DeletePlaylistAsync(userName, playlistName);
            return NoContent();
        }

        [HttpDelete("{userName}/collections/{playlistName}/songs/{songId}")]
        public async Task<IActionResult> DeleteSongFromPlaylist(string userName, string playlistName, decimal songId)
        {
            await _playlistService.DeleteSongFromPlaylistAsync(userName, songId, playlistName);
            return NoContent();
        }

        [HttpPut("{userName}/songs/{songId}/like")]
        public async Task<IActionResult> LikeSong(string userName, decimal songId)
        {
            await _playlistService.LikeSongAsync(userName, songId);
            return Ok();
        }

        [HttpPut("{userName}/songs/{songId}/unlike")]
        public async Task<IActionResult> UnlikeSong(string userName, decimal songId)
        {
            await _playlistService.UnlikeSongAsync(userName, songId);
            return Ok();
        }
    }
}
