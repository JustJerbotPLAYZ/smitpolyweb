using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Estrategy.SmitPolyweb.ClientPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedCertificateTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Certificates_CertificateID",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CertificateID",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CertificateID",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Certificates",
                table: "Tickets");

            migrationBuilder.CreateTable(
                name: "CertificateTickets",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    CertificateID = table.Column<int>(type: "int", nullable: false),
                    TicketID = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ModifiedBy = table.Column<int>(type: "int", nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificateTickets", x => x.ID);
                    table.ForeignKey(
                        name: "FK_CertificateTickets_Certificates_CertificateID",
                        column: x => x.CertificateID,
                        principalTable: "Certificates",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CertificateTickets_Tickets_TicketID",
                        column: x => x.TicketID,
                        principalTable: "Tickets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTickets_CertificateID",
                table: "CertificateTickets",
                column: "CertificateID");

            migrationBuilder.CreateIndex(
                name: "IX_CertificateTickets_TicketID",
                table: "CertificateTickets",
                column: "TicketID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CertificateTickets");

            migrationBuilder.AddColumn<int>(
                name: "CertificateID",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Certificates",
                table: "Tickets",
                type: "longtext",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CertificateID",
                table: "Tickets",
                column: "CertificateID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Certificates_CertificateID",
                table: "Tickets",
                column: "CertificateID",
                principalTable: "Certificates",
                principalColumn: "ID");
        }
    }
}
