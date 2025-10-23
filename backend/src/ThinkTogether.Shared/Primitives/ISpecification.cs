namespace Shared.Primitives;

public interface ISpecification<T>
{
    Func<T, bool> Criteria { get; }

    ISpecification<T> And(ISpecification<T> other);

    ISpecification<T> Or(ISpecification<T> other);

    ISpecification<T> Not();
}

