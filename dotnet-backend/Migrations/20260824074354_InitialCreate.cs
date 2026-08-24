using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ntay.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "banks",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_banks", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "idempotency_keys",
                columns: table => new
                {
                    key = table.Column<string>(type: "text", nullable: false),
                    endpoint = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    failure_reason = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    response_body = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_idempotency_keys", x => x.key);
                });

            migrationBuilder.CreateTable(
                name: "bank_accounts",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    account_number = table.Column<int>(type: "integer", nullable: false),
                    balance = table.Column<decimal>(type: "numeric", nullable: false),
                    owner_name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    bank_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_bank_accounts", x => x.id);
                    table.ForeignKey(
                        name: "f_k_bank_accounts_banks_bank_id",
                        column: x => x.bank_id,
                        principalTable: "banks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "account_pins",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    pin_hash = table.Column<string>(type: "text", nullable: false),
                    failed_attempts = table.Column<int>(type: "integer", nullable: false),
                    locked_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    bank_account_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_account_pins", x => x.id);
                    table.ForeignKey(
                        name: "f_k_account_pins__bank_accounts_bank_account_id",
                        column: x => x.bank_account_id,
                        principalTable: "bank_accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "payment_intents",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    attempt_count = table.Column<int>(type: "integer", nullable: false),
                    return_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    receiver_account_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_payment_intents", x => x.id);
                    table.ForeignKey(
                        name: "f_k_payment_intents_bank_accounts_receiver_account_id",
                        column: x => x.receiver_account_id,
                        principalTable: "bank_accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "transactions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    amount_transferred = table.Column<decimal>(type: "numeric", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    failure_reason = table.Column<string>(type: "text", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    sender_account_id = table.Column<int>(type: "integer", nullable: false),
                    receiver_account_id = table.Column<int>(type: "integer", nullable: false),
                    payment_intent_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_transactions", x => x.id);
                    table.ForeignKey(
                        name: "f_k_transactions_bank_accounts_receiver_account_id",
                        column: x => x.receiver_account_id,
                        principalTable: "bank_accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "f_k_transactions_bank_accounts_sender_account_id",
                        column: x => x.sender_account_id,
                        principalTable: "bank_accounts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "f_k_transactions_payment_intents_payment_intent_id",
                        column: x => x.payment_intent_id,
                        principalTable: "payment_intents",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "i_x_account_pins_bank_account_id",
                table: "account_pins",
                column: "bank_account_id");

            migrationBuilder.CreateIndex(
                name: "i_x_bank_accounts_bank_id",
                table: "bank_accounts",
                column: "bank_id");

            migrationBuilder.CreateIndex(
                name: "i_x_banks_name",
                table: "banks",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "i_x_payment_intents_receiver_account_id",
                table: "payment_intents",
                column: "receiver_account_id");

            migrationBuilder.CreateIndex(
                name: "i_x_transactions_payment_intent_id",
                table: "transactions",
                column: "payment_intent_id");

            migrationBuilder.CreateIndex(
                name: "i_x_transactions_receiver_account_id",
                table: "transactions",
                column: "receiver_account_id");

            migrationBuilder.CreateIndex(
                name: "i_x_transactions_sender_account_id",
                table: "transactions",
                column: "sender_account_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "account_pins");

            migrationBuilder.DropTable(
                name: "idempotency_keys");

            migrationBuilder.DropTable(
                name: "transactions");

            migrationBuilder.DropTable(
                name: "payment_intents");

            migrationBuilder.DropTable(
                name: "bank_accounts");

            migrationBuilder.DropTable(
                name: "banks");
        }
    }
}
