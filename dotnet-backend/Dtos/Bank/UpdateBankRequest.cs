namespace Ntay.Dtos.Bank;

public record UpdateBankRequest
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
