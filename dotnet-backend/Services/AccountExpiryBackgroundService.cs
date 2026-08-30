using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ntay.Data;
using Ntay.Events;

namespace Ntay.Services;

public class AccountExpiryBackgroundService(
    IServiceScopeFactory scopeFactory,
    AccountEventBroadcaster broadcaster,
    ILogger<AccountExpiryBackgroundService> logger
) : BackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(30);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(PollInterval);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await SyncExpiredAccountsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to sync expired accounts.");
            }
        }
    }

    private async Task SyncExpiredAccountsAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        var expiredAccounts = await dbContext
            .BankAccounts.Where(a => a.IsActive && a.ExpiresAt != null && a.ExpiresAt <= now)
            .ToListAsync(ct);

        if (expiredAccounts.Count == 0)
            return;

        foreach (var account in expiredAccounts)
        {
            account.IsActive = false;
        }

        await dbContext.SaveChangesAsync(ct);

        foreach (var account in expiredAccounts)
        {
            broadcaster.Publish(new AccountEvent("account_expired", account.AccountNumber));
        }
    }
}
