using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.Bank;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/banks")]
public class BankController : ControllerBase
{
    private readonly BankService _bankService;

    public BankController(BankService bankService)
    {
        _bankService = bankService;
    }

    [HttpGet]
    public async Task<ActionResult<List<BankResponse>>> GetBanks()
    {
        var banks = await _bankService.GetBanksAsync();
        return Ok(banks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BankResponse>> GetBank(int id)
    {
        var bank = await _bankService.GetBankByIdAsync(id);
        if (bank is null)
            return NotFound();
        return Ok(bank);
    }

    [HttpPost]
    public async Task<ActionResult<BankResponse>> CreateBank(CreateBankRequest request)
    {
        try
        {
            var bank = await _bankService.CreateBankAsync(request);
            return CreatedAtAction(nameof(GetBank), new { id = bank.Id }, bank);
        }
        catch (InvalidOperationException e)
        {
            return Conflict(new { error = e.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BankResponse>> UpdateBank(int id, UpdateBankRequest request)
    {
        try
        {
            var bank = await _bankService.UpdateBankAsync(id, request);
            if (bank is null)
                return NotFound();
            return Ok(bank);
        }
        catch (InvalidOperationException e)
        {
            return Conflict(new { error = e.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBank(int id)
    {
        var deleted = await _bankService.DeleteBankAsync(id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
