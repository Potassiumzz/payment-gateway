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
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? search = null
    )
    {
        if (page < 1 || limit < 1 || limit > 100)
            return BadRequest("page must be >= 1, limit must be between 1 and 100.");

        return Ok(await _accountService.GetAccountsAsync(search, page, limit));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BankAccountResponse>> GetAccount(int id)
    {
        BankAccountResponse? account = await _accountService.GetAccountById(id);
        return account is not null ? Ok(account) : NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<BankAccountResponse>> CreateAccount(CreateAccountRequest request)
    {
        try
        {
            BankAccountResponse account = await _accountService.CreateAccountAsync(request);
            return CreatedAtAction(nameof(GetAccount), new { id = account.Id }, account);
        }
        catch (InvalidOperationException e)
        {
            return BadRequest(new { error = e.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BankAccountResponse>> UpdateAccount(
        int id,
        UpdateAccountRequest request
    )
    {
        try
        {
            BankAccountResponse? account = await _accountService.UpdateAccountAsync(id, request);
            return account is not null ? Ok(account) : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return NotFound(new { error = e.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        bool account = await _accountService.DeactivateAccountAsync(id);
        return account ? NoContent() : NotFound();
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
