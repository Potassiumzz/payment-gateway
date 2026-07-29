using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ntay.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionAndPaymentIntent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaymentIntents",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AttemptCount = table.Column<int>(type: "integer", nullable: false),
                    ReturnUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReceiverAccountId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentIntents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentIntents_BankAccounts_ReceiverAccountId",
                        column: x => x.ReceiverAccountId,
                        principalTable: "BankAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AmountTransferred = table.Column<decimal>(type: "numeric", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    FailureReason = table.Column<string>(type: "text", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SenderAccountId = table.Column<int>(type: "integer", nullable: false),
                    ReceiverAccountId = table.Column<int>(type: "integer", nullable: false),
                    PaymentIntentId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_BankAccounts_ReceiverAccountId",
                        column: x => x.ReceiverAccountId,
                        principalTable: "BankAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_BankAccounts_SenderAccountId",
                        column: x => x.SenderAccountId,
                        principalTable: "BankAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transactions_PaymentIntents_PaymentIntentId",
                        column: x => x.PaymentIntentId,
                        principalTable: "PaymentIntents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentIntents_ReceiverAccountId",
                table: "PaymentIntents",
                column: "ReceiverAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PaymentIntentId",
                table: "Transactions",
                column: "PaymentIntentId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ReceiverAccountId",
                table: "Transactions",
                column: "ReceiverAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_SenderAccountId",
                table: "Transactions",
                column: "SenderAccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "PaymentIntents");
        }
    }
}
