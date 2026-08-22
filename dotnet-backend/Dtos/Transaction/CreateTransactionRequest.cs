using System.ComponentModel.DataAnnotations;
using Ntay.Dtos.Common;

namespace Ntay.Dtos.Transaction;

public record CreateTransactionRequest
{
    [Required]
    public required string PaymentIntentId { get; init; }

    public required int SenderAccountNumber { get; init; }
    public required int ReceiverAccountNumber { get; init; }

    [Pin]
    public required string SecurityPin { get; init; }
}
