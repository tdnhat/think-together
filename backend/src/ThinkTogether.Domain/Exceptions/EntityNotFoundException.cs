using Shared.Common;

namespace Domain.Exceptions;

public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, object id)
        : base($"Không tìm thấy {entityName} với ID {id}", 404)
    {
        EntityName = entityName;
        EntityId = id;
    }

    public string EntityName { get; }
    public object EntityId { get; }
}

