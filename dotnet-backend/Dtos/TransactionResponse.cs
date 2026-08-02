using System;

namespace Ntay.Dtos;

public record TransactionResponse
{
    public required int Id { get; init; }
    public required string PaymentIntentId { get; init; }

    public required int SenderAccountNumber { get; init; }
    public required string SenderOwnerName { get; init; }
    public required string SenderBankName { get; init; }

    public required int ReceiverAccountNumber { get; init; }
    public required string ReceiverOwnerName { get; init; }
    public required string ReceiverBankName { get; init; }

    public required TransactionStatus Status { get; init; }
    public string? FailureReason { get; init; }

    public required decimal AmountTransferred { get; init; }
    public required DateTime Timestamp { get; init; }
    public string? ReturnUrl { get; init; }
}
