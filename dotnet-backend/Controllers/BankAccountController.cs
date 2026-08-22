using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.BankAccount;
using Ntay.Dtos.Pagination;
using Ntay.Events;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/accounts")]
public class BankAccountController(
    BankAccountService _accountService,
    AccountEventBroadcaster _broadcaster
) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    [HttpGet]
    public async Task<ActionResult<PagedResponse<BankAccountResponse>>> GetAccounts(
        [FromQuery] PagedRequest request
    ) => Ok(await _accountService.GetAccountsAsync(request.Search, request.Page, request.Limit));

    [HttpGet("{accountNumber}")]
    public async Task<ActionResult<BankAccountResponse>> GetAccount(int accountNumber)
    {
        return Ok(await _accountService.GetAccountByNumber(accountNumber));
    }

    [HttpPost]
    public async Task<ActionResult<BankAccountResponse>> CreateAccount(CreateAccountRequest request)
    {
        BankAccountResponse account = await _accountService.CreateAccountAsync(request);
        return CreatedAtAction(
            nameof(GetAccount),
            new { accountNumber = account.AccountNumber },
            account
        );
    }

    [HttpPut("{accountNumber}")]
    public async Task<ActionResult<BankAccountResponse>> UpdateAccount(
        int accountNumber,
        UpdateAccountRequest request
    )
    {
        return Ok(await _accountService.UpdateAccountAsync(accountNumber, request));
    }

    [HttpDelete("{accountNumber}")]
    public async Task<IActionResult> DeleteAccount(int accountNumber)
    {
        return Ok(await _accountService.DeactivateAccountAsync(accountNumber));
    }

    [HttpGet("sse")]
    public async Task GetAccountEvents(CancellationToken cancellationToken)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("X-Accel-Buffering", "no");

        var (id, reader) = _broadcaster.Subscribe();
        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(
                    cancellationToken
                );
                timeoutCts.CancelAfter(TimeSpan.FromSeconds(30));

                try
                {
                    var evt = await reader.ReadAsync(timeoutCts.Token);
                    var json = JsonSerializer.Serialize(evt, JsonOptions);
                    await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
                catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
                {
                    await Response.WriteAsync(": keepalive\n\n", cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
        }
        finally
        {
            _broadcaster.Unsubscribe(id);
        }
    }
}
