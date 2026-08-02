using System;
using Ntay.Dtos;

namespace Ntay.Models;

public class IdempotencyKey
{
    public required string Key { get; set; }

    /// <summary>
    /// <para>Payment page's endpoint in the frontend.</para>
    /// <para>This endpoint is a combination of unique strings, which is payment intent's ID.</para>
    /// <para>Example of the path: {/checkout/k_qwe123asd...}</para>
    /// </summary>
    public required string Endpoint { get; set; }
    public required TransactionResponse ResponseBody { get; set; }
    public required TransactionStatus Status { get; set; }
    public required string? FailureReason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
