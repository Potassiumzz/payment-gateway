using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ntay.Data;
using Ntay.Dtos.AccountPin;
using Ntay.Dtos.Bank;
using Ntay.Dtos.BankAccount;
using Ntay.Dtos.Pagination;
using Ntay.Exceptions;
using Ntay.Mapping;
using Ntay.Models;

namespace Ntay.Services;

public class BankAccountService(AppDbContext _dbContext, AccountPinService _accountPinService)
{
    private async Task<int> GenerateAccountNumber(int bankId)
    {
        int? maxAccountNumber = await _dbContext
            .BankAccounts.Where(a => a.BankId == bankId)
            .Select(a => (int?)a.AccountNumber)
            .MaxAsync();

        if (maxAccountNumber is null)
            return int.Parse($"{bankId}00001");

        return maxAccountNumber.Value + 1;
    }

    public async Task<PagedResponse<BankAccountResponse>> GetAccountsAsync(
        string? search,
        int page,
        int limit
    )
    {
        var now = DateTime.UtcNow;

        var query = _dbContext
            .BankAccounts.Where(a => a.IsActive)
            .Where(a => a.ExpiresAt == null || a.ExpiresAt > now);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a =>
                EF.Functions.ILike(a.OwnerName, $"%{search}%")
                || EF.Functions.ILike(a.AccountNumber.ToString(), $"%{search}%")
            );
        }

        var total = await query.CountAsync();

        var offset = (page - 1) * limit;

        var items = await query
            .OrderByDescending(a => a.Id)
            .Skip(offset)
            .Take(limit)
            .Select(account => new BankAccountResponse
            {
                AccountNumber = account.AccountNumber,
                OwnerName = account.OwnerName,
                IsActive = account.IsActive,
                IsDefault = account.IsDefault,
                Balance = account.Balance,
                ExpiresAt = account.ExpiresAt,
                Bank = new BankResponse { Id = account.Bank.Id, Name = account.Bank.Name },
            })
            .ToListAsync();

        return new PagedResponse<BankAccountResponse>
        {
            Items = items,
            Total = total,
            Page = page,
            Limit = limit,
        };
    }

    public async Task<BankAccountResponse> GetAccountByNumber(int accountNumber)
    {
        return await _dbContext
                .BankAccounts.Where(a => a.AccountNumber == accountNumber)
                .Select(a => new BankAccountResponse
                {
                    AccountNumber = a.AccountNumber,
                    OwnerName = a.OwnerName,
                    IsActive = a.IsActive,
                    IsDefault = a.IsDefault,
                    Balance = a.Balance,
                    ExpiresAt = a.ExpiresAt,
                    Bank = new BankResponse { Id = a.Bank.Id, Name = a.Bank.Name },
                })
                .SingleOrDefaultAsync()
            ?? throw new NotFoundException($"Account number {accountNumber} not found.");
    }

    public async Task<BankAccount> GetMutableAccountByNumberAsync(int accountNumber)
    {
        return await _dbContext
                .BankAccounts.Include(b => b.Bank)
                .Where(b => b.AccountNumber == accountNumber)
                .SingleOrDefaultAsync()
            ?? throw new NotFoundException($"Account number {accountNumber} not found.");
    }

    public async Task<BankAccountResponse> CreateAccountAsync(CreateAccountRequest request)
    {
        Bank? bank = await _dbContext.Banks.SingleOrDefaultAsync(b => b.Id == request.BankId);
        if (bank is null)
            throw new NotFoundException("Bank does not exist.");

        BankAccount account = new BankAccount
        {
            AccountNumber = await GenerateAccountNumber(request.BankId),
            OwnerName = request.OwnerName,
            BankId = request.BankId,
            Balance = 500.00m,
            IsActive = true,
            IsDefault = false,
            ExpiresAt = DateTime.UtcNow.AddDays(2),
        };
        account.Bank = bank;

        await using var createAccountTransaction =
            await _dbContext.Database.BeginTransactionAsync();
        try
        {
            _dbContext.BankAccounts.Add(account);
            await _dbContext.SaveChangesAsync();
            await _accountPinService.CreatePinAsync(
                new CreatePinRequest { AccountId = account.Id, Pin = request.Pin }
            );
            await createAccountTransaction.CommitAsync();
        }
        catch (Exception e)
        {
            await createAccountTransaction.RollbackAsync();
            throw e;
        }

        return account.ToBankAccountResponse();
    }

    public async Task<BankAccountResponse> UpdateAccountAsync(
        int accountNumber,
        UpdateAccountRequest request
    )
    {
        BankAccount? account =
            await _dbContext
                .BankAccounts.Include(a => a.Bank)
                .SingleOrDefaultAsync(a => a.Id == accountNumber)
            ?? throw new NotFoundException($"Account number {accountNumber} not found.");

        account.OwnerName = request.OwnerName;
        await _dbContext.SaveChangesAsync();

        return account.ToBankAccountResponse();
    }

    public async Task<bool> DeactivateAccountAsync(int accountNumber)
    {
        BankAccount? account =
            await _dbContext
                .BankAccounts.Where(a => a.AccountNumber == accountNumber)
                .SingleOrDefaultAsync()
            ?? throw new NotFoundException($"Account number {accountNumber} not found.");

        account.IsActive = false;
        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<BankAccountResponse> RefillBalanceAsync(int accountNumber)
    {
        BankAccount? account = await GetMutableAccountByNumberAsync(accountNumber);

        if (account.Balance < 500)
            account.Balance = 500;
        await _dbContext.SaveChangesAsync();

        return account.ToBankAccountResponse();
    }
}
