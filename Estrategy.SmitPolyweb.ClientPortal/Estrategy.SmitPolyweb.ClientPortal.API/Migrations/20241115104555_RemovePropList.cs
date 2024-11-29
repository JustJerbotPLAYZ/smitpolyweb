using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estrategy.SmitPolyweb.ClientPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class RemovePropList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_ArticleTypes_ArticleTypeID",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_ArticleTypeID",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "ArticleTypeID",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "UserIDs",
                table: "Customers");

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "CertificateProperties",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArticleTypeID",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserIDs",
                table: "Customers",
                type: "longtext",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "CertificateProperties",
                type: "longtext",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_ArticleTypeID",
                table: "Properties",
                column: "ArticleTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_ArticleTypes_ArticleTypeID",
                table: "Properties",
                column: "ArticleTypeID",
                principalTable: "ArticleTypes",
                principalColumn: "ID");
        }
    }
}
