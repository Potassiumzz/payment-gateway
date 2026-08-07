namespace Ntay.Dtos.PaymentIntent;

public record IntentResponse
{
    public required string Id { get; init; }
    public required decimal Amount { get; init; }
    public required PaymentIntentStatus Status { get; init; }
    public required string? ReturnUrl { get; init; }
    public required int? ReceiverAccountNumber { get; init; }
    public required string CheckoutUrl { get; init; }
    public required int AttemptCount { get; init; }
}
