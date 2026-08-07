using System;
using Ntay.Dtos.Transaction;

namespace Ntay.Dtos.Idempotency;

public record IdempotencyResponse
{
    public required string Key { get; init; }
    public required string Endpoint { get; init; }
    public required TransactionResponse ResponseBody { get; init; }
    public required TransactionStatus Status { get; init; }
    public required string? FailureReason { get; init; }
    public required DateTime CreatedAt { get; init; }
}
