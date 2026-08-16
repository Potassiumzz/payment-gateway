using Ntay.Dtos.Bank;
using Ntay.Dtos.BankAccount;
using Ntay.Models;

namespace Ntay.Mapping;

public static class BankAccountMapper
{
    /// <summary>
    /// Maps a <see cref="BankAccount"/> entity to its corresponding <see cref="BankAccountResponse"/> DTO.
    /// </summary>
    /// <param name="account">The bank account entity to map. Its <c>Bank</c> navigation property must be loaded.</param>
    /// <returns>A <see cref="BankAccountResponse"/> representing the account.</returns>
    public static BankAccountResponse ToBankAccountResponse(this BankAccount account) =>
        new()
        {
            AccountNumber = account.AccountNumber,
            OwnerName = account.OwnerName,
            IsActive = account.IsActive,
            IsDefault = account.IsDefault,
            Balance = account.Balance,
            ExpiresAt = account.ExpiresAt,
            Bank = new BankResponse { Id = account.Bank.Id, Name = account.Bank.Name },
        };
}
