using System;

namespace Ntay.Models;

public class PaymentIntent
{
    private static string GenerateId() => $"k_{Guid.NewGuid():N}";

    public string Id { get; set; } = GenerateId();
    public required decimal Amount { get; set; }
    public required PaymentIntentStatus Status { get; set; }
    public required int AttemptCount { get; set; }
    public string? ReturnUrl { get; set; }
    public required DateTime CreatedAt { get; set; }

    public int? ReceiverAccountId { get; set; }
    public BankAccount? ReceiverAccount { get; set; }
}
