# Specification Pattern Implementation

## Overview
This document describes the Specification Pattern implementation for query building with eager loading support.

## Components

### 1. Specification Base Class (`Shared.Primitives.Specification<T>`)
Located in: `backend/src/ThinkTogether.Shared/Primitives/Specification.cs`

```csharp
public abstract class Specification<T> where T : AggregateRoot
{
    public Expression<Func<T, bool>> Criteria { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; }
    public List<string> IncludeStrings { get; }
    public Expression<Func<T, object>>? OrderBy { get; protected set; }
    public Expression<Func<T, object>>? OrderByDescending { get; protected set; }
    public int Take { get; protected set; }
    public int Skip { get; protected set; }
    public bool IsPagingEnabled { get; protected set; }
    
    protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
    protected virtual void AddInclude(string includeString)
    protected virtual void ApplyPaging(int skip, int take)
    protected virtual void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
    protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
}
```

**Features:**
- ✅ Type-safe query criteria
- ✅ Eager loading with `Include` (both expression and string-based)
- ✅ Ordering (ascending and descending)
- ✅ Pagination support
- ✅ Reusable and composable

### 2. RefreshTokenSpecification (`Shared.Primitives.RefreshTokenSpecification`)
Located in: `backend/src/ThinkTogether.Shared/Primitives/RefreshTokenSpecification.cs`

```csharp
public sealed class RefreshTokenSpecification : Specification<User>
{
    public RefreshTokenSpecification(string refreshToken)
    {
        Criteria = u => u.RefreshTokens.Any(rt => rt.Token == refreshToken);
        AddInclude(u => u.RefreshTokens);
    }
}
```

**Usage:**
- Finds a user by refresh token
- Eagerly loads the RefreshTokens collection
- Used in `RefreshTokenCommandHandler`

### 3. IRepository Extension (`IRepository<TAggregate, TId>`)
Added method:
```csharp
Task<TAggregate?> GetBySpecAsync(Specification<TAggregate> spec, CancellationToken cancellationToken = default);
```

### 4. Repository Implementation (`Repository<TAggregate, TId>`)
Added method implementation:
```csharp
public virtual async Task<TAggregate?> GetBySpecAsync(Specification<TAggregate> spec, CancellationToken cancellationToken = default)
{
    return await ApplySpecification(spec).FirstOrDefaultAsync(cancellationToken);
}

protected virtual IQueryable<TAggregate> ApplySpecification(Specification<TAggregate> spec)
{
    var query = _dbSet.AsQueryable();
    query = query.Where(spec.Criteria);
    query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));
    query = spec.IncludeStrings.Aggregate(query, (current, include) => current.Include(include));
    
    if (spec.OrderBy != null)
        query = query.OrderBy(spec.OrderBy);
    
    if (spec.OrderByDescending != null)
        query = query.OrderByDescending(spec.OrderByDescending);
    
    if (spec.IsPagingEnabled)
        query = query.Skip(spec.Skip).Take(spec.Take);
    
    return query;
}
```

## Usage Examples

### Creating a Custom Specification

```csharp
public sealed class GetActiveUsersSpecification : Specification<User>
{
    public GetActiveUsersSpecification()
    {
        Criteria = u => !u.IsDeleted;
        AddInclude(u => u.RefreshTokens);
        ApplyOrderByDescending(u => u.CreatedAt);
    }
}
```

### Using in a Handler

```csharp
// Find user by refresh token with eager loading
var user = await _userRepository.GetBySpecAsync(
    new RefreshTokenSpecification(refreshToken), 
    cancellationToken);

// Result: User with RefreshTokens already loaded (no N+1 query)
```

## Benefits

✅ **Type-Safe Queries** - Uses expressions instead of strings
✅ **Eager Loading** - Prevents N+1 query problems
✅ **Reusable** - Specifications can be composed and reused
✅ **Testable** - Easy to unit test query logic
✅ **Clean** - Encapsulates complex query logic
✅ **Performant** - Single database round trip with all needed data

## When to Use

Use Specification Pattern when:
- You need complex filtering logic
- You want eager loading to prevent N+1 queries
- You need pagination
- You want reusable query logic

## Integration with RefreshToken Feature

The `RefreshTokenSpecification` is used in the refresh token endpoint to:
1. Find the user by refresh token
2. Eagerly load the RefreshTokens collection
3. Validate the token
4. Generate new tokens

This ensures a single database query retrieves all needed data.

## Files Created/Modified

✅ Created: `Shared.Primitives.Specification<T>` - Base specification class
✅ Created: `Shared.Primitives.RefreshTokenSpecification` - Refresh token finder
✅ Modified: `Shared.Primitives.IRepository<TAggregate, TId>` - Added GetBySpecAsync
✅ Modified: `Infrastructure.Persistence.Repositories.Repository<TAggregate, TId>` - Implemented GetBySpecAsync & ApplySpecification
✅ Modified: `Application.Handlers.User.Commands.RefreshToken.RefreshTokenCommandHandler` - Uses new specification

## Performance Note

The `ApplySpecification` method builds an `IQueryable` chain that is executed as a single SQL query:
- One SELECT with JOINs for includes
- WHERE clause for criteria
- ORDER BY for sorting
- OFFSET/FETCH for pagination

This is much more efficient than loading all data and filtering in-memory.
