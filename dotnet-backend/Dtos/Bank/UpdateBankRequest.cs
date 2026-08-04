namespace Ntay.Dtos.Bank;

public record UpdateBankRequest
{
    public required string Name { get; init; }
}
