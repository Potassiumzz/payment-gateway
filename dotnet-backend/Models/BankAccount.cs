namespace Ntay.Models;

public class BankAccount
{
    public required int Id { get; set; }
    public required int AccountNumber { get; set; }
    public required decimal Balance { get; set; }
    public required string OwnerName { get; set; }
    public required bool IsActive { get; set; }
    public required bool IsDefault { get; set; }
    public required DateTime ExpiresAt { get; set; }

    public required int BankId { get; set; }
    public Bank Bank { get; set; } = null!;
}
