using System.ComponentModel;

namespace ThinkTogether.Domain.Enums;

public enum LeaderboardTimePeriod
{
    [Description("today")]
    Today,
    
    [Description("week")]
    Week,
    
    [Description("month")]
    Month,
    
    [Description("all")]
    All
}
