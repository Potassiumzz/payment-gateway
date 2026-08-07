using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Ntay.Data;
using Ntay.Dtos.PaymentIntent;
using Ntay.Models;

namespace Ntay.Services;

public class PaymentIntentService
{
    private const decimal MaxAmount = 999999m;
    private readonly AppDbContext _dbContext;
    private readonly string _checkoutUrl;

    public PaymentIntentService(AppDbContext context, IConfiguration configuration)
    {
        _dbContext = context;
        string _frontendUrl =
            configuration["FrontendUrl"]
            ?? throw new InvalidOperationException("FrontendUrl is not configured.");
        _checkoutUrl = $"{_frontendUrl}/checkout";
    }

    private async Task<BankAccount> GetReceiverAccount(int accountNumber)
    {
        BankAccount? receiverAccount = await _dbContext.BankAccounts.SingleOrDefaultAsync(a =>
            a.AccountNumber == accountNumber
        );
        if (receiverAccount is null)
            throw new InvalidOperationException("Receiver account not found");
        return receiverAccount;
    }

    public async Task<IntentResponse> CreateIntentAsync(CreateIntentRequest request)
    {
        if (request.Amount > MaxAmount)
            throw new InvalidOperationException("Amount exceeds maximum allowed value.");

        BankAccount? receiverAccount = request.ReceiverAccountNumber is { } accountNumber
            ? await GetReceiverAccount(accountNumber)
            : null;

        PaymentIntent intent = new PaymentIntent
        {
            Amount = request.Amount,
            Status = PaymentIntentStatus.RequiresPayment,
            ReturnUrl = request.ReturnUrl,
            ReceiverAccountId = receiverAccount?.Id,
        };
        _dbContext.PaymentIntents.Add(intent);
        await _dbContext.SaveChangesAsync();
        return new IntentResponse
        {
            Id = intent.Id,
            Amount = intent.Amount,
            Status = intent.Status,
            ReturnUrl = intent.ReturnUrl,
            ReceiverAccountNumber = receiverAccount?.AccountNumber,
            AttemptCount = intent.AttemptCount,
            CheckoutUrl = $"{_checkoutUrl}/{intent.Id}",
        };
    }

    public async Task<IntentResponse?> GetIntentDetailsAsync(string id)
    {
        return await _dbContext
            .PaymentIntents.Where(i => i.Id == id)
            .Select(i => new IntentResponse
            {
                Id = i.Id,
                Amount = i.Amount,
                Status = i.Status,
                ReturnUrl = i.ReturnUrl,
                ReceiverAccountNumber = i.ReceiverAccountId,
                AttemptCount = i.AttemptCount,
                CheckoutUrl = $"{_checkoutUrl}/{i.Id}",
            })
            .SingleOrDefaultAsync();
    }

    public async Task<PaymentIntent?> GetMutableIntentAsync(string id)
    {
        return await _dbContext.PaymentIntents.SingleOrDefaultAsync(p => p.Id == id);
    }
}
