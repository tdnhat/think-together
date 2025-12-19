namespace ThinkTogether.Application.Interfaces;

/// <summary>
/// Simple background task queue to run short, fire-and-forget jobs.
/// </summary>
public interface IBackgroundTaskQueue
{
    void QueueBackgroundWorkItem(Func<IServiceProvider, CancellationToken, Task> workItem);

    ValueTask<Func<IServiceProvider, CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken);
}


