using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.PaymentIntent;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/payment-intents")]
public class PaymentIntentController(PaymentIntentService _intentService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<IntentResponse>> CreatePaymentIntent(CreateIntentRequest request)
    {
        return Ok(await _intentService.CreateIntentAsync(request));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IntentResponse>> GetPaymentIntent(string id)
    {
        return Ok(await _intentService.GetIntentDetailsAsync(id));
    }
}
