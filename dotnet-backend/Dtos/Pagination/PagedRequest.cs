using System.ComponentModel.DataAnnotations;

namespace Ntay.Dtos.Pagination;

public record PagedRequest
{
    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int Limit { get; init; } = 10;
    public string? Search { get; init; }
}
