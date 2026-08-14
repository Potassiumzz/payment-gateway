using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.BankAccount;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/api/accounts")]
public class BankAccountController : ControllerBase
{
    private readonly BankAccountService _accountService;

    public BankAccountController(BankAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<ActionResult<List<BankAccountResponse>>> GetAccounts()
    {
        return Ok(await _accountService.GetAccountsAsync());
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
}
