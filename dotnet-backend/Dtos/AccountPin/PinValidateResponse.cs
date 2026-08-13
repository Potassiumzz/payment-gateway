namespace Ntay.Dtos.AccountPin;

public record PinValidateResponse
{
    public required int ResponseCode { get; init; }
    public required string ResponseMsg { get; init; }
}
