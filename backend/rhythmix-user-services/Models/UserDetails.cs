using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace rhythmix_user_services.Models
{
    public class UserDetails
    {
        [Key]
        public Guid userId { get; set; } = Guid.NewGuid();

        [Required]
        public string userName { get; set; }

        [Phone]
        public string phone { get; set; }

        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string password { get; set; }

        public UserMetadata metadata { get; set; }

        [JsonIgnore]
        public ICollection<UserLibrary> library { get; set; } = new List<UserLibrary>();
    }
}
