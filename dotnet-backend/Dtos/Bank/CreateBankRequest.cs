using System.ComponentModel.DataAnnotations;

namespace Ntay.Dtos.Bank;

public record CreateBankRequest
{
    [Required]
    public required string Name { get; init; }
};
