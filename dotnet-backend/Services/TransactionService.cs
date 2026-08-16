using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ntay.Data;
using Ntay.Dtos.AccountPin;
using Ntay.Dtos.Idempotency;
using Ntay.Dtos.Transaction;
using Ntay.Models;

namespace Ntay.Services;

public class TransactionService(
    AppDbContext _dbContext,
    PaymentIntentService intentService,
    BankAccountService accountService,
    AccountPinService pinService,
    IdempotencyService idempotencyService
)
{
    private const string Endpoint = "/transactions";
    private const int MaxPaymentIntentAttempt = 3;

    public async Task<TransactionResponse> CreateTransactionAsync(
        CreateTransactionRequest request,
        string idempotencyKey
    )
    {
        var sender = await GetValidatedSenderAsync(
            request.SenderAccountNumber,
            request.SecurityPin
        );

        var existingIdempotency = await idempotencyService.GetExistingResponseAsync(
            idempotencyKey,
            Endpoint
        );
        if (existingIdempotency is { Status: TransactionStatus.Succeeded })
            return existingIdempotency.ResponseBody;

        var intent = await GetProcessableIntentAsync(request.PaymentIntentId);
        var receiver = await GetReceiverAsync(request.ReceiverAccountNumber);

        if (sender.AccountNumber == receiver.AccountNumber)
            throw new InvalidOperationException("Self-transfer is not permitted.");

        var (status, failureReason) = DetermineStatus(sender, intent.Amount);

        intent.AttemptCount += 1;
        ApplyBalanceChanges(sender, receiver, intent, status);

        var transaction = await PersistTransactionAsync(
            intent,
            sender,
            receiver,
            status,
            failureReason
        );
        var transactionResponse = BuildTransactionResponse(
            transaction,
            intent,
            sender,
            receiver,
            status
        );

        await SaveOrUpdateIdempotencyAsync(
            idempotencyKey,
            existingIdempotency,
            transactionResponse,
            status,
            failureReason
        );

        return transactionResponse;
    }

    public async Task<List<TransactionResponse>> GetTransactionsAsync()
    {
        return await _dbContext
            .Transactions.Select(t => new TransactionResponse
            {
                Id = t.Id,
                PaymentIntentId = t.PaymentIntentId,
                SenderAccountNumber = t.SenderAccount.AccountNumber,
                SenderOwnerName = t.SenderAccount.OwnerName,
                SenderBankName = t.SenderAccount.Bank.Name,
                ReceiverAccountNumber = t.ReceiverAccount.AccountNumber,
                ReceiverOwnerName = t.ReceiverAccount.OwnerName,
                ReceiverBankName = t.ReceiverAccount.Bank.Name,
                Status = t.Status,
                FailureReason = t.FailureReason,
                AmountTransferred = t.AmountTransferred,
                Timestamp = t.Timestamp,
            })
            .ToListAsync();
    }

    private async Task<BankAccount> GetValidatedSenderAsync(int accountNumber, string securityPin)
    {
        var sender = await accountService.GetMutableAccountByNumberAsync(accountNumber);
        if (sender is null)
            throw new InvalidOperationException("Sender's bank account not found.");

        await pinService.ValidatePinAsync(
            new ValidatePinRequest { AccountNumber = sender.AccountNumber, Pin = securityPin }
        );

        return sender;
    }

    private async Task<PaymentIntent> GetProcessableIntentAsync(string paymentIntentId)
    {
        var intent = await intentService.GetMutableIntentAsync(paymentIntentId);
        if (intent is null)
            throw new InvalidOperationException("Payment intent not found.");
        if (intent.Status != PaymentIntentStatus.RequiresPayment)
            throw new InvalidOperationException("Payment intent was already processed, try again.");

        return intent;
    }

    private async Task<BankAccount> GetReceiverAsync(int accountNumber)
    {
        var receiver = await accountService.GetMutableAccountByNumberAsync(accountNumber);
        if (receiver is null)
            throw new InvalidOperationException("Receiver's bank account not found.");

        return receiver;
    }

    private static (TransactionStatus Status, string? FailureReason) DetermineStatus(
        BankAccount sender,
        decimal amount
    ) =>
        sender.Balance < amount
            ? (TransactionStatus.Failed, "Low balance")
            : (TransactionStatus.Succeeded, null);

    private static void ApplyBalanceChanges(
        BankAccount sender,
        BankAccount receiver,
        PaymentIntent intent,
        TransactionStatus status
    )
    {
        if (status == TransactionStatus.Succeeded)
        {
            sender.Balance -= intent.Amount;
            receiver.Balance += intent.Amount;
            intent.Status = PaymentIntentStatus.Succeeded;
        }
        else if (intent.AttemptCount >= MaxPaymentIntentAttempt)
        {
            intent.Status = PaymentIntentStatus.Failed;
        }
    }

    private async Task<Transaction> PersistTransactionAsync(
        PaymentIntent intent,
        BankAccount sender,
        BankAccount receiver,
        TransactionStatus status,
        string? failureReason
    )
    {
        Transaction? existingTransaction = await _dbContext.Transactions.SingleOrDefaultAsync(t =>
            t.PaymentIntentId == intent.Id
        );

        if (existingTransaction is not null)
        {
            existingTransaction.ReceiverAccountId = receiver.Id;
            existingTransaction.AmountTransferred = intent.Amount;
            existingTransaction.Status = status;
            existingTransaction.FailureReason = failureReason;
            existingTransaction.Timestamp = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return existingTransaction;
        }

        Transaction transaction = new()
        {
            AmountTransferred = intent.Amount,
            Status = status,
            FailureReason = failureReason,
            SenderAccountId = sender.Id,
            ReceiverAccountId = receiver.Id,
            PaymentIntentId = intent.Id,
        };

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync();

        return transaction;
    }

    private static TransactionResponse BuildTransactionResponse(
        Transaction transaction,
        PaymentIntent intent,
        BankAccount sender,
        BankAccount receiver,
        TransactionStatus status
    ) =>
        new()
        {
            Id = transaction.Id,
            PaymentIntentId = intent.Id,
            SenderAccountNumber = sender.AccountNumber,
            ReceiverAccountNumber = receiver.AccountNumber,
            SenderOwnerName = sender.OwnerName,
            ReceiverOwnerName = receiver.OwnerName,
            SenderBankName = sender.Bank.Name,
            ReceiverBankName = receiver.Bank.Name,
            Status = status,
            AmountTransferred = intent.Amount,
            Timestamp = transaction.Timestamp,
        };

    private async Task SaveOrUpdateIdempotencyAsync(
        string idempotencyKey,
        IdempotencyResponse? existing,
        TransactionResponse response,
        TransactionStatus status,
        string? failureReason
    )
    {
        if (existing is not null)
        {
            await idempotencyService.UpdateResponseAsync(
                new UpdateIdempotencyRequest
                {
                    Key = idempotencyKey,
                    ResponseBody = response,
                    Status = status,
                    FailureReason = failureReason,
                }
            );
        }
        else
        {
            await idempotencyService.SaveResponseAsync(
                new CreateIdempotencyRequest
                {
                    Key = idempotencyKey,
                    Endpoint = Endpoint,
                    ResponseBody = response,
                    Status = status,
                    FailureReason = failureReason,
                }
            );
        }
    }
}
