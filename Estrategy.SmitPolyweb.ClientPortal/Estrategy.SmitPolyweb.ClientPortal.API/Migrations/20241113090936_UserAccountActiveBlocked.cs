using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estrategy.SmitPolyweb.ClientPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class UserAccountActiveBlocked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AccountActive",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AccountBlocked",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AccountBlocked",
                table: "Users");
        }
    }
}
