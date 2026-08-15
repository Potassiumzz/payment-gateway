using System.Collections.Generic;

namespace Ntay.Dtos.Pagination;

public record PagedResponse<T>
{
    public required List<T> Items { get; init; }
    public required int Total { get; init; }
    public required int Page { get; init; }
    public required int Limit { get; init; }
}
