namespace Ntay.Dtos.AccountPin;

public record ValidatePinRequest
{
    public required int AccountId { get; init; }
    public required string Pin { get; init; }
}
