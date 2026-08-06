using System.ComponentModel.DataAnnotations;

namespace Ntay.Dtos.BankAccount;

public record CreateAccountRequest
{
    public required string OwnerName { get; init; }
    public required int BankId { get; init; }

    [StringLength(4, MinimumLength = 4, ErrorMessage = "Pin must be exactly 4 digits.")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Pin must be numeric.")]
    public required string Pin { get; init; }
}
