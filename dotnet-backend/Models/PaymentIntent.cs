using System;

namespace Ntay.Models;

public class PaymentIntent
{
    public required int Id { get; set; }
    public required decimal Amount { get; set; }
    public required PaymentIntentStatus Status { get; set; }
    public required int AttemptCount { get; set; }
    public int? ReceiverAccountNumber { get; set; }
    public string? ReturnUrl { get; set; }
    public required DateTime CreatedAt { get; set; }
}
