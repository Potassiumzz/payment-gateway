using System.ComponentModel.DataAnnotations;
using Ntay.Dtos.Common;

namespace Ntay.Dtos.BankAccount;

public record CreateAccountRequest
{
    [Required]
    public required string OwnerName { get; init; }

    public required int BankId { get; init; }

    [Pin]
    public required string Pin { get; init; }
}
