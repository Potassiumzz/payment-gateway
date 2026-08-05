using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ntay.Data;
using Ntay.Dtos.Bank;
using Ntay.Models;

namespace Ntay.Services;

public class BankService
{
    private readonly AppDbContext _dbContext;

    public BankService(AppDbContext context)
    {
        _dbContext = context;
    }

    public async Task<List<BankResponse>> GetBanksAsync()
    {
        var banks = await _dbContext.Banks.ToListAsync();
        return banks.Select(b => new BankResponse { Id = b.Id, Name = b.Name }).ToList();
    }

    public async Task<BankResponse?> GetBankByIdAsync(int id)
    {
        var bank = await _dbContext.Banks.FindAsync(id);
        if (bank is null)
            return null;
        return new BankResponse { Id = bank.Id, Name = bank.Name };
    }

    public async Task<BankResponse> CreateBankAsync(CreateBankRequest request)
    {
        var nameExists = await _dbContext.Banks.AnyAsync(b => b.Name == request.Name);
        if (nameExists)
            throw new InvalidOperationException($"Bank with name '{request.Name}' already exists.");

        var bank = new Bank { Name = request.Name };
        _dbContext.Banks.Add(bank);
        await _dbContext.SaveChangesAsync();
        return new BankResponse { Id = bank.Id, Name = bank.Name };
    }

    public async Task<BankResponse?> UpdateBankAsync(int id, UpdateBankRequest request)
    {
        var bank = await _dbContext.Banks.FindAsync(id);
        if (bank is null)
            return null;

        var nameExists = await _dbContext.Banks.AnyAsync(b => b.Name == request.Name);
        if (nameExists)
            throw new InvalidOperationException($"Bank with name '{request.Name}' already exists.");

        bank.Name = request.Name;
        await _dbContext.SaveChangesAsync();
        return new BankResponse { Id = bank.Id, Name = bank.Name };
    }

    public async Task<bool> DeleteBankAsync(int id)
    {
        var bank = await _dbContext.Banks.FindAsync(id);
        if (bank is null)
            return false;

        _dbContext.Banks.Remove(bank);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}
