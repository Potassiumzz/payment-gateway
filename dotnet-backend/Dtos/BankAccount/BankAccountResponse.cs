using System;
using Ntay.Dtos.Bank;

namespace Ntay.Dtos.BankAccount;

public record BankAccountResponse
{
    public required int Id { get; init; }
    public required int AccountNumber { get; init; }
    public required string OwnerName { get; init; }
    public required decimal Balance { get; init; }
    public required bool IsActive { get; init; }
    public required bool IsDefault { get; init; }
    public DateTime? ExpiresAt { get; init; }
    public required BankResponse Bank { get; init; }
}
