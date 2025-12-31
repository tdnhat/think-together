using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum LeaderboardSortBy
{
    [Description("score")]
    Score,
    
    [Description("accuracy")]
    Accuracy,
    
    [Description("time")]
    Time,
    
    [Description("completedAt")]
    CompletedAt
}
