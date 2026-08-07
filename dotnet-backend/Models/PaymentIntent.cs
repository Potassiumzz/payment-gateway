using System;

namespace Ntay.Models;

public class PaymentIntent
{
    private static string GenerateId() => $"k_{Guid.NewGuid():N}";

    public string Id { get; set; } = GenerateId();
    public required decimal Amount { get; set; }
    public required PaymentIntentStatus Status { get; set; }
    public int AttemptCount { get; set; } = 0;
    public required string? ReturnUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int? ReceiverAccountId { get; set; }
    public BankAccount? ReceiverAccount { get; set; }
}
