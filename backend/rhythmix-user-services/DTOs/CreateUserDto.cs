using System.ComponentModel.DataAnnotations;

namespace rhythmix_user_services.DTOs
{
    public class CreateUserDto
    {
        [Required]
        public string userName { get; set; }

        [Phone]
        public string phone { get; set; }

        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string password { get; set; }

        public MetadataDto metadata { get; set; }
    }
    public class MetadataDto
    {
        public string preferredGenre { get; set; }
        public string preferredArtist { get; set; }
        public string preferredLanguage { get; set; }
    }
}
