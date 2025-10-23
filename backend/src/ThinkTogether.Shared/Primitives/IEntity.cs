namespace Shared.Primitives;

public interface IEntity<TId>
{
    TId Id { get; }
}
