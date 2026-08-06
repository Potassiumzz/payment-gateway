namespace Ntay.Dtos.BankAccount;

public record UpdateAccountRequest
{
    public required string OwnerName { get; init; }
}
