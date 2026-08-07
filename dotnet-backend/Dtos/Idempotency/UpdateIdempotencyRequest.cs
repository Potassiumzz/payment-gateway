using Ntay.Dtos.Transaction;

namespace Ntay.Dtos.Idempotency;

public record UpdateIdempotencyRequest
{
    public required string Key { get; init; }
    public required TransactionResponse ResponseBody { get; init; }
    public required TransactionStatus Status { get; init; }
    public required string? FailureReason { get; init; }
}
