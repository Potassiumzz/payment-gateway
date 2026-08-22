using Ntay.Dtos.Common;

namespace Ntay.Dtos.AccountPin;

public record CreatePinRequest
{
    public required int AccountId { get; init; }

    [Pin]
    public required string Pin { get; init; }
}
