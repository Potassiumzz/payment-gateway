using System;

namespace Ntay.Models;

public class Transaction
{
    public required int Id { get; set; }
    public required int SenderAccountNumber { get; set; }
    public required int ReceiverAccountNumber { get; set; }
    public required decimal AmountTransferred { get; set; }
    public required TransactionStatus Status { get; set; }
    public required string PaymentIntentId { get; set; }
    public string? FailureReason { get; set; }
    public required DateTime Timestamp { get; set; }
}
