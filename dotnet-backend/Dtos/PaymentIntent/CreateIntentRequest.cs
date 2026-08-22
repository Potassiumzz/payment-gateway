using System.ComponentModel.DataAnnotations;

namespace Ntay.Dtos.PaymentIntent;

public record CreateIntentRequest
{
    [Range(1, double.MaxValue, ErrorMessage = "Amount has to be greater than zero.")]
    public required decimal Amount { get; init; }
    public string? ReturnUrl { get; init; }
    public int? ReceiverAccountNumber { get; init; }
}
