using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Shared.Infrastructure.Hubs;

public abstract class BaseHub : Hub
{
    protected async Task SendToGroupAsync(string groupName, string method, object data)
    {
        await Clients.Group(groupName).SendAsync(method, data);
    }

    protected async Task SendToAllAsync(string method, object data)
    {
        await Clients.All.SendAsync(method, data);
    }

    protected async Task SendToUserAsync(string userId, string method, object data)
    {
        await Clients.User(userId).SendAsync(method, data);
    }
}
