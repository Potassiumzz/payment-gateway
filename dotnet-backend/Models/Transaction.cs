using System;

namespace Ntay.Models;

public class Transaction
{
    public required int Id { get; set; }
    public required decimal AmountTransferred { get; set; }
    public required TransactionStatus Status { get; set; }
    public string? FailureReason { get; set; }
    public required DateTime Timestamp { get; set; }

    public required int SenderAccountId { get; set; }
    public BankAccount SenderAccount { get; set; } = null!;

    public required int ReceiverAccountId { get; set; }
    public BankAccount ReceiverAccount { get; set; } = null!;

    public required string PaymentIntentId { get; set; }
    public PaymentIntent PaymentIntent { get; set; } = null!;
}
