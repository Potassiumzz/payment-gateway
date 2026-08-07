namespace Ntay.Dtos.Transaction;

public record CreateTransactionRequest
{
    public required string PaymentIntentId { get; init; }
    public required int SenderAccountNumber { get; init; }
    public required int ReceiverAccountNumber { get; init; }
    public required string SecurityPin { get; init; }
}
