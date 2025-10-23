using Domain.Aggregates.ChallengeAggregate.Repositories;
using Domain.Aggregates.GameSessionAggregate.Repositories;
using Domain.Aggregates.QuizSetAggregate.Repositories;
using Domain.Aggregates.UserAggregate.Repositories;
using Shared.Common;
using Infrastructure.Persistence.Repositories;

namespace Infrastructure.Persistence.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IUserRepository? _userRepository;
    private IQuizSetRepository? _quizSetRepository;
    private IGameSessionRepository? _gameSessionRepository;
    private IChallengeRepository? _challengeRepository;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IUserRepository Users
    {
        get
        {
            _userRepository ??= new UserRepository(_context);
            return _userRepository;
        }
    }

    public IQuizSetRepository QuizSets
    {
        get
        {
            _quizSetRepository ??= new QuizSetRepository(_context);
            return _quizSetRepository;
        }
    }

    public IGameSessionRepository GameSessions
    {
        get
        {
            _gameSessionRepository ??= new GameSessionRepository(_context);
            return _gameSessionRepository;
        }
    }

    public IChallengeRepository Challenges
    {
        get
        {
            _challengeRepository ??= new ChallengeRepository(_context);
            return _challengeRepository;
        }
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.CommitTransactionAsync(cancellationToken);
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.RollbackTransactionAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context?.Dispose();
        GC.SuppressFinalize(this);
    }

    public async ValueTask DisposeAsync()
    {
        if (_context != null)
        {
            await _context.DisposeAsync();
        }

        GC.SuppressFinalize(this);
    }
}
