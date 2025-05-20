using Microsoft.EntityFrameworkCore;
using rhythmix_user_services.Models;

namespace rhythmix_user_services.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<UserMetadata> UserMetadata { get; set; }
        public DbSet<UserLibrary> UserLibrary { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Explicit table mappings
            modelBuilder.Entity<UserDetails>().ToTable("UserDetails");
            modelBuilder.Entity<UserMetadata>().ToTable("UserMetadata");
            modelBuilder.Entity<UserLibrary>().ToTable("UserLibrary");

            // userName must be unique
            modelBuilder.Entity<UserDetails>()
                .HasIndex(u => u.userName)
                .IsUnique();

            // One-to-one: UserDetails <--> UserMetadata
            modelBuilder.Entity<UserDetails>()
                .HasOne(u => u.metadata)
                .WithOne(m => m.user)
                .HasForeignKey<UserMetadata>(m => m.userId);

            // UserLibrary timestamp defaults
            modelBuilder.Entity<UserLibrary>(entity =>
            {
                entity.Property(e => e.createdAt)
                      .HasDefaultValueSql("NOW()")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.updatedAt)
                      .HasDefaultValueSql("NOW()")
                      .ValueGeneratedOnAddOrUpdate();
            });
        }
    }
}
