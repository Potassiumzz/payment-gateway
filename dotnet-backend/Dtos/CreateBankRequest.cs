namespace Ntay.Dtos;

public record CreateBankRequest
{
    public required string Name { get; init; }
};
