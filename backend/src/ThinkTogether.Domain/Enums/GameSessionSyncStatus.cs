using System.ComponentModel;
using System.Text.Json.Serialization;

namespace ThinkTogether.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum GameSessionSyncStatus
{
    [Description("LOBBY")]
    Lobby,
    
    [Description("IN_PROGRESS")]
    InProgress,
    
    [Description("FINISHED")]
    Finished,
    
    [Description("UNKNOWN")]
    Unknown
}
