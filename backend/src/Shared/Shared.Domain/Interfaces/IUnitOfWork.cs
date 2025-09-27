using System.Threading.Tasks;

namespace Shared.Domain.Interfaces;

public interface IUnitOfWork
{
    Task CommitAsync();
    Task RollbackAsync();
}
