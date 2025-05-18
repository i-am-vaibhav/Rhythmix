// Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using rhythmix_user_services.Data;
using rhythmix_user_services.DTOs;
using rhythmix_user_services.Models;

namespace rhythmix_user_services.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserDetails> CreateUserAsync(CreateUserDto dto)
        {
            var exists = await _context.UserDetails.AnyAsync(u => u.userName == dto.userName);
            if (exists)
                throw new Exception("Username already exists.");

            var userId = Guid.NewGuid();
            var metadataId = Guid.NewGuid();

            var user = new UserDetails
            {
                userId = userId,
                userName = dto.userName,
                phone = dto.phone,
                email = dto.email,
                password = dto.password,
                metadata = new UserMetadata
                {
                    metadataId = metadataId,
                    userId = userId,
                    preferredArtist = dto.metadata.preferredArtist,
                    preferredGenre = dto.metadata.preferredGenre,
                    preferredLanguage = dto.metadata.preferredLanguage
                }
            };

            await _context.UserDetails.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<UserDetails?> GetUserAsync(string value)
        {
            if (Guid.TryParse(value, out Guid userId))
            {
                return await _context.UserDetails
                    .Include(u => u.metadata)
                    .FirstOrDefaultAsync(u => u.userId == userId);
            }

            return await _context.UserDetails
                .Include(u => u.metadata)
                .FirstOrDefaultAsync(u => u.userName == value);
        }
    }
}
