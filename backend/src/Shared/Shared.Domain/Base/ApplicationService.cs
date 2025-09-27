using MediatR;
using System.Threading.Tasks;

namespace Shared.Domain.Base;

public abstract class ApplicationService
{
    protected readonly IMediator Mediator;

    protected ApplicationService(IMediator mediator)
    {
        Mediator = mediator;
    }

    protected async Task<TResponse> SendCommandAsync<TResponse>(IRequest<TResponse> request)
    {
        return await Mediator.Send(request);
    }

    protected async Task SendCommandAsync(IRequest request)
    {
        await Mediator.Send(request);
    }
}
