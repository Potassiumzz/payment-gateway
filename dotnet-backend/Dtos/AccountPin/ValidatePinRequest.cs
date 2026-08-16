namespace Ntay.Dtos.AccountPin;

public record ValidatePinRequest
{
    public required int AccountNumber { get; init; }
    public required string Pin { get; init; }
}
