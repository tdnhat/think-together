using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.DTOs;

/// <summary>
/// Class DTO
/// </summary>
public class ClassDto
{
    public Guid Id { get; set; }
    public Guid TeacherId { get; set; }
    public string? TeacherName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string JoinCode { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public int? MemberCount { get; set; }
    public int? HomeworkCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Class Member DTO
/// </summary>
public class ClassMemberDto
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public DateTime JoinedAt { get; set; }
    public DateTime? LeftAt { get; set; }
}

/// <summary>
/// Homework DTO
/// </summary>
public class HomeworkDto
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public Guid QuizSetId { get; set; }
    public string? QuizSetTitle { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime AssignedAt { get; set; }
    public int? SubmissionCount { get; set; }
    public bool IsOverdue { get; set; }
    public bool? HasSubmission { get; set; }
    public Guid? SubmissionId { get; set; }
}

/// <summary>
/// Homework Submission DTO
/// </summary>
public class HomeworkSubmissionDto
{
    public Guid Id { get; set; }
    public Guid HomeworkId { get; set; }
    public Guid StudentId { get; set; }
    public string? StudentName { get; set; }
    public Guid ChallengeAttemptId { get; set; }
    public int Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public SubmissionStatus Status { get; set; }
}

/// <summary>
/// Class Detail DTO (includes members and homeworks)
/// </summary>
public class ClassDetailDto : ClassDto
{
    public List<ClassMemberDto> Members { get; set; } = new();
    public List<HomeworkDto> Homeworks { get; set; } = new();
}

/// <summary>
/// Homework Detail DTO (includes submissions)
/// </summary>
public class HomeworkDetailDto : HomeworkDto
{
    public List<HomeworkSubmissionDto> Submissions { get; set; } = new();
}

/// <summary>
/// Paginated Class Response DTO
/// </summary>
public class ClassResponseDto
{
    public List<ClassDto> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

/// <summary>
/// Paginated Homework Response DTO
/// </summary>
public class HomeworkResponseDto
{
    public List<HomeworkDto> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

/// <summary>
/// Homework Submission Detail DTO (includes challenge attempt with questions and answers)
/// </summary>
public class HomeworkSubmissionDetailDto
{
    public HomeworkSubmissionDto Submission { get; set; } = null!;
    public ChallengeAttemptDto Attempt { get; set; } = null!;
    public HomeworkDto Homework { get; set; } = null!;
}

/// <summary>
/// Per-question statistics for homework
/// </summary>
public class QuestionStatisticsDto
{
    public Guid QuestionId { get; set; }
    public string QuestionContent { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public int CorrectAnswerCount { get; set; }
    public int WrongAnswerCount { get; set; }
    public double CorrectPercentage { get; set; }
    public int TotalAnswers { get; set; }
}

/// <summary>
/// Homework Statistics DTO (for teachers)
/// </summary>
public class HomeworkStatisticsDto
{
    public HomeworkDto Homework { get; set; } = null!;
    
    // Overall statistics
    public int TotalStudents { get; set; }
    public int SubmittedCount { get; set; }
    public int NotSubmittedCount { get; set; }
    public double CompletionRate { get; set; }
    public double AverageScore { get; set; }
    public int HighestScore { get; set; }
    public int LowestScore { get; set; }
    
    // Per-question statistics
    public List<QuestionStatisticsDto> QuestionStatistics { get; set; } = new();
    
    // Student submissions list
    public List<HomeworkSubmissionDto> StudentSubmissions { get; set; } = new();
}
