using Ntay.Dtos.Idempotency;
using Ntay.Models;

namespace Ntay.Mapping;

public static class IdempotencyMapper
{
    /// <summary>
    /// Maps a <see cref="IdempotencyKey"/> entity to its corresponding <see cref="IdempotencyResponse"/> DTO.
    /// </summary>
    /// <param name="idempotency">The idempotency entity to map.</param>
    /// <returns>A <see cref="IdempotencyResponse"/> representing the idempotency for a transaction.</returns>
    public static IdempotencyResponse ToIdempotencyResponse(this IdempotencyKey idempotency) =>
        new()
        {
            Key = idempotency.Key,
            Endpoint = idempotency.Endpoint,
            ResponseBody = idempotency.ResponseBody,
            Status = idempotency.Status,
            FailureReason = idempotency.FailureReason,
            CreatedAt = idempotency.CreatedAt,
        };
}
