using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ntay.Data;
using Ntay.Dtos.Idempotency;
using Ntay.Mapping;
using Ntay.Models;

namespace Ntay.Services;

public class IdempotencyService
{
    private readonly AppDbContext _dbContext;

    public IdempotencyService(AppDbContext context)
    {
        _dbContext = context;
    }

    public async Task<IdempotencyResponse?> GetExistingResponseAsync(string key, string endpoint)
    {
        return await _dbContext
            .IdempotencyKeys.Where(i => i.Key == key && i.Endpoint == endpoint)
            .Select(idempotency => new IdempotencyResponse
            {
                Key = idempotency.Key,
                Endpoint = idempotency.Endpoint,
                ResponseBody = idempotency.ResponseBody,
                Status = idempotency.Status,
                FailureReason = idempotency.FailureReason,
                CreatedAt = idempotency.CreatedAt,
            })
            .SingleOrDefaultAsync();
    }

    public async Task<IdempotencyResponse> SaveResponseAsync(CreateIdempotencyRequest request)
    {
        IdempotencyKey idempotency = new IdempotencyKey
        {
            Key = request.Key,
            Endpoint = request.Endpoint,
            ResponseBody = request.ResponseBody,
            Status = request.Status,
            FailureReason = request.FailureReason,
        };
        _dbContext.IdempotencyKeys.Add(idempotency);
        await _dbContext.SaveChangesAsync();

        return idempotency.ToIdempotencyResponse();
    }

    public async Task<IdempotencyResponse?> UpdateResponseAsync(UpdateIdempotencyRequest request)
    {
        IdempotencyKey? idempotency = await _dbContext.IdempotencyKeys.FindAsync(request.Key);
        if (idempotency is null)
            return null;

        idempotency.ResponseBody = request.ResponseBody;
        idempotency.Status = request.Status;
        idempotency.FailureReason = request.FailureReason;
        await _dbContext.SaveChangesAsync();

        return idempotency.ToIdempotencyResponse();
    }
}
