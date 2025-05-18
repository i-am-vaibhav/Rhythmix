using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace rhythmix_user_services.Models
{
    public class UserMetadata
    {
        [Key]
        public Guid metadataId { get; set; } = Guid.NewGuid();

        public string preferredGenre { get; set; }
        public string preferredArtist { get; set; }
        public string preferredLanguage { get; set; }
        [JsonIgnore]
        public Guid userId { get; set; }

        [JsonIgnore]
        public UserDetails? user { get; set; }
    }
}
