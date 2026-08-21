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
    public async Task<ActionResult<List<BankResponse>>> GetBanks() =>
        Ok(await _bankService.GetBanksAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<BankResponse>> GetBank(int id) =>
        Ok(await _bankService.GetBankByIdAsync(id));

    [HttpPost]
    public async Task<ActionResult<BankResponse>> CreateBank(CreateBankRequest request)
    {
        var bank = await _bankService.CreateBankAsync(request);
        return CreatedAtAction(nameof(GetBank), new { id = bank.Id }, bank);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BankResponse>> UpdateBank(int id, UpdateBankRequest request) =>
        Ok(await _bankService.UpdateBankAsync(id, request));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBank(int id)
    {
        var deleted = await _bankService.DeleteBankAsync(id);
        return NoContent();
    }
}
