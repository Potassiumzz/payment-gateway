namespace Ntay.Dtos.Bank;

public record BankResponse
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
