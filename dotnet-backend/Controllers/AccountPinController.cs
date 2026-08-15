using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ntay.Dtos.AccountPin;
using Ntay.Services;

namespace Ntay.Controllers;

[ApiController]
[Route("/pin")]
public class AccountPinController(AccountPinService _pinService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PinValidateResponse>> ValidatePin(ValidatePinRequest request)
    {
        await _pinService.ValidatePinAsync(request);
        return Ok(new PinValidateResponse { ResponseCode = 0, ResponseMsg = "PIN Validate" });
    }
}
