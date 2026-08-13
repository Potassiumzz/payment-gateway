using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.Transaction;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/api/transactions")]
public class TransactionController(TransactionService _transactionService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> CreateTransaction(
        CreateTransactionRequest request,
        [FromHeader(Name = "Idempotency-Key")] string idempotencyKey
    )
    {
        return Ok(await _transactionService.CreateTransactionAsync(request, idempotencyKey));
    }

    [HttpGet]
    public async Task<ActionResult<List<TransactionResponse>>> GetTransactions()
    {
        return Ok(await _transactionService.GetTransactionsAsync());
    }
}
