using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estrategy.SmitPolyweb.ClientPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class CertificateAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_Addresses_AddressID",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_AddressID",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "AddressID",
                table: "Certificates");

            migrationBuilder.AddColumn<int>(
                name: "CustomerAddressID",
                table: "Certificates",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SupplierAddressID",
                table: "Certificates",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_CustomerAddressID",
                table: "Certificates",
                column: "CustomerAddressID");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_SupplierAddressID",
                table: "Certificates",
                column: "SupplierAddressID");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_Addresses_CustomerAddressID",
                table: "Certificates",
                column: "CustomerAddressID",
                principalTable: "Addresses",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_Addresses_SupplierAddressID",
                table: "Certificates",
                column: "SupplierAddressID",
                principalTable: "Addresses",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_Addresses_CustomerAddressID",
                table: "Certificates");

            migrationBuilder.DropForeignKey(
                name: "FK_Certificates_Addresses_SupplierAddressID",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_CustomerAddressID",
                table: "Certificates");

            migrationBuilder.DropIndex(
                name: "IX_Certificates_SupplierAddressID",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "CustomerAddressID",
                table: "Certificates");

            migrationBuilder.DropColumn(
                name: "SupplierAddressID",
                table: "Certificates");

            migrationBuilder.AddColumn<int>(
                name: "AddressID",
                table: "Certificates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_AddressID",
                table: "Certificates",
                column: "AddressID");

            migrationBuilder.AddForeignKey(
                name: "FK_Certificates_Addresses_AddressID",
                table: "Certificates",
                column: "AddressID",
                principalTable: "Addresses",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
