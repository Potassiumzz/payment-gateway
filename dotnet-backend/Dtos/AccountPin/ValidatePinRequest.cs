using Ntay.Dtos.Common;

namespace Ntay.Dtos.AccountPin;

public record ValidatePinRequest
{
    public required int AccountNumber { get; init; }

    [Pin]
    public required string Pin { get; init; }
}
