using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;
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

        // Get class and homework using specification
        var spec = new ClassWithHomeworkStatisticsSpec(request.HomeworkId);
        var classEntity = await _classRepository.GetBySpecAsync(spec, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException("Bài tập về nhà", request.HomeworkId);
        }

        // Verify class ID matches
        if (classEntity.Id != request.ClassId)
        {
            throw new ValidationException("Class ID không khớp với homework");
        }

        var homework = classEntity.Homeworks.FirstOrDefault(h => h.Id == request.HomeworkId && h.DeletedAt == null);
        if (homework == null)
        {
            throw new EntityNotFoundException("Bài tập về nhà", request.HomeworkId);
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

        // Get all class members (students) - exclude teacher and inactive members
        var totalStudents = classEntity.Members.Count(m => m.LeftAt == null && m.UserId != classEntity.TeacherId);

        // Get all submissions
        var submissions = homework.Submissions.ToList();
        var submittedCount = submissions.Count;
        var notSubmittedCount = Math.Max(0, totalStudents - submittedCount); // Ensure non-negative
        var completionRate = totalStudents > 0 ? Math.Round((double)submittedCount / totalStudents * 100, 1) : 0;

        // Calculate overall statistics
        var scores = submissions.Select(s => s.Score).ToList();
        var averageScore = scores.Any() ? Math.Round(scores.Average(), 1) : 0;
        var highestScore = scores.Any() ? scores.Max() : 0;
        var lowestScore = scores.Any() ? scores.Min() : 0;

        // Load challenge attempts for all submissions to get per-question statistics
        var attemptIds = submissions.Select(s => s.ChallengeAttemptId).Distinct().ToList();
        var questionStatistics = new List<QuestionStatisticsDto>();

        // Batch load all attempts to avoid N+1 queries
        var attempts = new List<Domain.Aggregates.ChallengeAggregate.Entities.ChallengeAttempt>();
        foreach (var attemptId in attemptIds)
        {
            var challengeSpec = new ChallengeByAttemptIdSpec(attemptId);
            var challenge = await _challengeRepository.GetBySpecAsync(challengeSpec, cancellationToken);
            if (challenge != null)
            {
                var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == attemptId);
                if (attempt != null)
                {
                    attempts.Add(attempt);
                }
            }
        }

        foreach (var question in questions)
        {
            var correctCount = 0;
            var wrongCount = 0;

            // Check answers for this question across all attempts
            foreach (var attempt in attempts)
            {
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
            var correctPercentage = totalAnswers > 0 ? Math.Round((double)correctCount / totalAnswers * 100, 1) : 0;

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

        // Map submissions with student names and attempt data
        var submissionDtos = new List<HomeworkSubmissionDto>();

        foreach (var submission in submissions)
        {
            var dto = submission.Adapt<HomeworkSubmissionDto>();

            // Load attempt data for this submission
            var attemptSpec = new ChallengeByAttemptIdSpec(submission.ChallengeAttemptId);
            var challenge = await _challengeRepository.GetBySpecAsync(attemptSpec, cancellationToken);
            if (challenge != null)
            {
                var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == submission.ChallengeAttemptId);
                if (attempt != null)
                {
                    dto.CorrectAnswers = attempt.CorrectAnswers;
                    dto.TotalQuestions = attempt.TotalQuestions;
                    dto.CompletionTimeMs = attempt.CompletionTimeMs;
                }
            }

            // Set student name
            if (students.TryGetValue(submission.StudentId, out var student))
            {
                dto.StudentName = student.GetFullName();
            }

            submissionDtos.Add(dto);
        }

        submissionDtos = submissionDtos
            .OrderByDescending(s => s.Score)
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

