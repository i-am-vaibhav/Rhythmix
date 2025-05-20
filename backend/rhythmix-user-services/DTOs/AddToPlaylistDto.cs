namespace rhythmix_user_services.DTOs
{
    public class AddToPlaylistDto
    {
        public Guid userId { get; set; }
        public decimal songId { get; set; }
        public string PlaylistName { get; set; } = string.Empty;
    }
}
