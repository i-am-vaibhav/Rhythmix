using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace rhythmix_user_services.Models
{
    public class UserLibrary
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("userId")]
        public Guid userId { get; set; }
        public Guid mediaId { get; set; }
        public string playlistName { get; set; }
        public bool isLiked { get; set; }

    }
}
