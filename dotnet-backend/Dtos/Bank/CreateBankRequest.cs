namespace Ntay.Dtos.Bank;

public record CreateBankRequest
{
    public required string Name { get; init; }
};
