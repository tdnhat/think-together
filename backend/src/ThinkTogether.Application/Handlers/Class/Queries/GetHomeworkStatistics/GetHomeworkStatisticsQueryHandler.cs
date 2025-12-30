using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkStatistics;

public sealed class GetHomeworkStatisticsQueryHandler : IRequestHandler<GetHomeworkStatisticsQuery, HomeworkStatisticsDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetHomeworkStatisticsQueryHandler(
        IClassRepository classRepository,
        IChallengeRepository challengeRepository,
        IQuizSetRepository quizSetRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _classRepository = classRepository;
        _challengeRepository = challengeRepository;
        _quizSetRepository = quizSetRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<HomeworkStatisticsDto> Handle(
        GetHomeworkStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        // Verify user is teacher
        var userIdString = _currentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var userId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        // Get class and homework
        var result = await _classRepository.GetClassAndHomeworkByHomeworkIdAsync(request.HomeworkId, cancellationToken);
        if (!result.HasValue)
        {
            throw new EntityNotFoundException("Bài tập về nhà", request.HomeworkId);
        }

        var (classEntity, homework) = result.Value;

        // Verify class ID matches
        if (classEntity.Id != request.ClassId)
        {
            throw new ValidationException("Class ID không khớp với homework");
        }

        // Verify user is the teacher
        if (classEntity.TeacherId != userId)
        {
            throw new UnauthorizedException("Chỉ giáo viên của lớp mới có thể xem thống kê");
        }

        // Load quiz set and questions
        var quizSet = await _quizSetRepository.GetByIdAsync(homework.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", homework.QuizSetId);

        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        // Get all class members (students)
        var totalStudents = classEntity.Members.Count(m => m.LeftAt == null && m.UserId != classEntity.TeacherId);

        // Get all submissions
        var submissions = homework.Submissions.ToList();
        var submittedCount = submissions.Count;
        var notSubmittedCount = totalStudents - submittedCount;
        var completionRate = totalStudents > 0 ? (double)submittedCount / totalStudents * 100 : 0;

        // Calculate overall statistics
        var scores = submissions.Select(s => s.Score).ToList();
        var averageScore = scores.Any() ? scores.Average() : 0;
        var highestScore = scores.Any() ? scores.Max() : 0;
        var lowestScore = scores.Any() ? scores.Min() : 0;

        // Load challenge attempts for all submissions to get per-question statistics
        var attemptIds = submissions.Select(s => s.ChallengeAttemptId).ToList();
        var questionStatistics = new List<QuestionStatisticsDto>();

        foreach (var question in questions)
        {
            var correctCount = 0;
            var wrongCount = 0;

            // Load attempts and check answers for this question
            foreach (var attemptId in attemptIds)
            {
                var spec = new ChallengeByAttemptIdSpec(attemptId);
                var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken);
                if (challenge == null) continue;

                var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == attemptId);
                if (attempt == null) continue;

                var answer = attempt.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                if (answer != null)
                {
                    if (answer.IsCorrect)
                        correctCount++;
                    else
                        wrongCount++;
                }
            }

            var totalAnswers = correctCount + wrongCount;
            var correctPercentage = totalAnswers > 0 ? (double)correctCount / totalAnswers * 100 : 0;

            questionStatistics.Add(new QuestionStatisticsDto
            {
                QuestionId = question.Id,
                QuestionContent = question.Content,
                DisplayOrder = question.DisplayOrder,
                CorrectAnswerCount = correctCount,
                WrongAnswerCount = wrongCount,
                CorrectPercentage = correctPercentage,
                TotalAnswers = totalAnswers
            });
        }

        // Load student names for submissions
        var studentIds = submissions.Select(s => s.StudentId).Distinct().ToList();
        var studentsList = await _userRepository.GetByIdsAsync(studentIds, cancellationToken);
        var students = studentsList.ToDictionary(u => u.Id);

        // Map submissions with student names
        var submissionDtos = submissions.Select(s =>
        {
            var dto = s.Adapt<HomeworkSubmissionDto>();
            if (students.TryGetValue(s.StudentId, out var student))
            {
                dto.StudentName = student.GetFullName();
            }
            return dto;
        }).OrderByDescending(s => s.Score)
          .ThenByDescending(s => s.SubmittedAt)
          .ToList();

        // Map homework DTO
        var homeworkDto = homework.Adapt<HomeworkDto>();
        homeworkDto.SubmissionCount = submissions.Count;
        homeworkDto.IsOverdue = homework.IsOverdue;
        homeworkDto.QuizSetTitle = quizSet.Title;

        return new HomeworkStatisticsDto
        {
            Homework = homeworkDto,
            TotalStudents = totalStudents,
            SubmittedCount = submittedCount,
            NotSubmittedCount = notSubmittedCount,
            CompletionRate = completionRate,
            AverageScore = averageScore,
            HighestScore = highestScore,
            LowestScore = lowestScore,
            QuestionStatistics = questionStatistics,
            StudentSubmissions = submissionDtos
        };
    }
}

