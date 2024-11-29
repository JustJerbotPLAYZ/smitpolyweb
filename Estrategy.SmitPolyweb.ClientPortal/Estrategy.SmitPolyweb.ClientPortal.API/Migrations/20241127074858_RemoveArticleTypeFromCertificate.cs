using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estrategy.SmitPolyweb.ClientPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveArticleTypeFromCertificate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_ArticleTypes_ArticleTypeID",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_ArticleTypeID",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "ArticleTypeID",
                table: "Certificates");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArticleTypeID",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_ArticleTypeID",
                table: "Certificates",
                column: "ArticleTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_ArticleTypes_ArticleTypeID",
                table: "Certificates",
                column: "ArticleTypeID",
                principalTable: "ArticleTypes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
