namespace Ntay.Dtos.PaymentIntent;

public record CreateIntentRequest
{
    public required decimal Amount { get; init; }
    public string? ReturnUrl { get; init; }
    public int? ReceiverAccountNumber { get; init; }
}
