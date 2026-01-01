using ThinkTogether.Domain.Aggregates.CategoryAggregate;
using ThinkTogether.Domain.Aggregates.CategoryAggregate.Repositories;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Shared.Primitives;
using ThinkTogether.Shared.Common;

namespace ThinkTogether.Infrastructure.Persistence.Repositories;

public class CategoryRepository : Repository<Category, Guid>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Category>> GetAllActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive && c.DeletedAt == null)
            .OrderBy(c => c.Name) // Changed from DisplayOrder
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(c => c.Name == name && c.DeletedAt == null);

        if (excludeId.HasValue)
        {
            query = query.Where(c => c.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<Category>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive && c.DeletedAt == null && c.Name.Contains(searchTerm))
            .OrderBy(c => c.Name) // Changed from DisplayOrder
            .ToListAsync(cancellationToken);
    }

    public async Task<PaginatedResponse<Category>> GetPaginatedAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Where(c => c.IsActive && c.DeletedAt == null)
            .OrderBy(c => c.Name);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PaginatedResponse<Category>
        {
            Data = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Categories.CountAsync(cancellationToken);
    }
}

