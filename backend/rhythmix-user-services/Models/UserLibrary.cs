using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace rhythmix_user_services.Models
{
    public class UserLibrary
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [ForeignKey("userId")]
        public Guid userId { get; set; }
        public decimal songId { get; set; }
        public bool liked { get; set; }
        public string playlistName { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}
