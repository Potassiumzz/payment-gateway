using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Ntay.Exceptions;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        var (statusCode, title) = exception switch
        {
            AppException appEx => (appEx.StatusCode, appEx.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred."),
        };

        if (exception is not AppException)
            logger.LogError(exception, "Unhandled exception");

        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response.WriteAsJsonAsync(
            new ProblemDetails { Status = statusCode, Title = title },
            cancellationToken
        );

        return true;
    }
}
