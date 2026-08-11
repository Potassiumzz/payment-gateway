namespace Ntay.Dtos.AccountPin;

public record CreatePinRequest
{
    public required int AccountId { get; init; }
    public required string Pin { get; init; }
}
