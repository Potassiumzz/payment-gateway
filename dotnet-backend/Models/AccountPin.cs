using System;

namespace Ntay.Models;

public class AccountPin
{
    public int Id { get; set; }
    public required string PinHash { get; set; }
    public int FailedAttempts { get; set; } = 0;
    public DateTime? LockedUntil { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public required int BankAccountId { get; set; }
    public BankAccount BankAccount { get; set; } = null!;
}
