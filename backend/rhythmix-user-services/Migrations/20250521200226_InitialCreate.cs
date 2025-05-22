using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace rhythmix_user_services.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserDetails",
                columns: table => new
                {
                    userId = table.Column<Guid>(type: "uuid", nullable: false),
                    userName = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.userId);
                });

            migrationBuilder.CreateTable(
                name: "UserLibrary",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userName = table.Column<string>(type: "text", nullable: false),
                    songId = table.Column<decimal>(type: "numeric", nullable: false),
                    liked = table.Column<bool>(type: "boolean", nullable: false),
                    playlistName = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UserDetailsuserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLibrary", x => x.id);
                    table.ForeignKey(
                        name: "FK_UserLibrary_UserDetails_UserDetailsuserId",
                        column: x => x.UserDetailsuserId,
                        principalTable: "UserDetails",
                        principalColumn: "userId");
                });

            migrationBuilder.CreateTable(
                name: "UserMetadata",
                columns: table => new
                {
                    metadataId = table.Column<Guid>(type: "uuid", nullable: false),
                    preferredGenre = table.Column<string>(type: "text", nullable: false),
                    preferredArtist = table.Column<string>(type: "text", nullable: false),
                    preferredLanguage = table.Column<string>(type: "text", nullable: false),
                    userId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMetadata", x => x.metadataId);
                    table.ForeignKey(
                        name: "FK_UserMetadata_UserDetails_userId",
                        column: x => x.userId,
                        principalTable: "UserDetails",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserDetails_userName",
                table: "UserDetails",
                column: "userName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserLibrary_UserDetailsuserId",
                table: "UserLibrary",
                column: "UserDetailsuserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMetadata_userId",
                table: "UserMetadata",
                column: "userId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserLibrary");

            migrationBuilder.DropTable(
                name: "UserMetadata");

            migrationBuilder.DropTable(
                name: "UserDetails");
        }
    }
}
