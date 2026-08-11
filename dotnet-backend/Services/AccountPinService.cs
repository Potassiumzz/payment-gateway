using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ntay.Data;
using Ntay.Dtos.AccountPin;
using Ntay.Models;
using Ntay.Security;

namespace Ntay.Services;

public class AccountPinService
{
    private const int MaxAttempts = 3;
    private static readonly TimeSpan LockTime = TimeSpan.FromMinutes(5);

    private readonly AppDbContext _dbContext;

    public AccountPinService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreatePinAsync(CreatePinRequest request)
    {
        AccountPin pin = new AccountPin
        {
            BankAccountId = request.AccountId,
            PinHash = PinHasher.HashPin(request.Pin),
        };
        _dbContext.AccountPins.Add(pin);
        await _dbContext.SaveChangesAsync();
        return;
    }

    public async Task ValidatePinAsync(ValidatePinRequest request)
    {
        AccountPin? pin = await _dbContext.AccountPins.SingleOrDefaultAsync(p =>
            p.BankAccountId == request.AccountId
        );

        if (pin is null)
            throw new InvalidOperationException("Security PIN not set for this account");

        DateTime now = DateTime.UtcNow;

        if (pin.LockedUntil != null && pin.LockedUntil >= now)
            throw new InvalidOperationException(
                "Account temporarily locked due to failed PIN attempts."
            );

        if (!PinHasher.VerifyPin(request.Pin, pin.PinHash))
        {
            pin.FailedAttempts += 1;

            if (pin.FailedAttempts >= MaxAttempts)
            {
                pin.LockedUntil = now + LockTime;
                await _dbContext.SaveChangesAsync();
                throw new InvalidOperationException(
                    "Account temporarily locked due to failed PIN attempts."
                );
            }

            await _dbContext.SaveChangesAsync();
            throw new InvalidOperationException("Invalid security PIN.");
        }

        pin.FailedAttempts = 0;
        pin.LockedUntil = null;

        await _dbContext.SaveChangesAsync();
    }
}
