namespace rhythmix_user_services.DTOs
{
    public class AddToPlaylistDto
    {
        public string userName { get; set; } = string.Empty;
        public decimal songId { get; set; }
        public string playlistName { get; set; } = string.Empty;
    }
}