using System.Linq;
using Microsoft.Extensions.Configuration;
using Ntay.Models;
using Ntay.Security;

namespace Ntay.Data.Seed;

public class SeedDatabase
{
    private static readonly string[] DefaultBankNames = ["Maze Bank", "Lombank"];

    private record DefaultAccount(
        int AccountNumber,
        decimal Balance,
        string OwnerName,
        int BankIndex
    );

    private static readonly DefaultAccount[] DefaultAccounts =
    [
        new(100001, 500, "Michael De Santa", 0),
        new(100002, 500, "Trevor Philips", 0),
        new(200001, 500, "Franklin Clinton", 1),
    ];

    private readonly AppDbContext _dbContext;
    private readonly string _defaultPin;

    public SeedDatabase(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _defaultPin = configuration["Seeding:DefaultAccountPin"] ?? "4321";
    }

    public void SeedDefaults()
    {
        if (_dbContext.Banks.Any())
        {
            return;
        }

        var banks = DefaultBankNames.Select(name => new Bank { Name = name }).ToArray();
        _dbContext.Banks.AddRange(banks);
        _dbContext.SaveChanges();

        foreach (var acc in DefaultAccounts)
        {
            var account = new BankAccount
            {
                AccountNumber = acc.AccountNumber,
                Balance = acc.Balance,
                OwnerName = acc.OwnerName,
                BankId = banks[acc.BankIndex].Id,
                IsActive = true,
                IsDefault = true,
                ExpiresAt = null,
            };
            _dbContext.BankAccounts.Add(account);
            _dbContext.SaveChanges();

            _dbContext.AccountPins.Add(
                new AccountPin
                {
                    BankAccountId = account.Id,
                    PinHash = PinHasher.HashPin(_defaultPin),
                }
            );
        }

        _dbContext.SaveChanges();
    }
}
