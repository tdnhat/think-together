using Mapster;
using MediatR;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Application.Interfaces;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ChallengeAggregate.Specifications;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Specifications;
using ThinkTogether.Domain.Enums;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Repositories;
using ThinkTogether.Domain.Aggregates.UserAggregate.Repositories;
using ThinkTogether.Domain.Exceptions;

namespace ThinkTogether.Application.Handlers.Class.Queries.GetHomeworkSubmission;

public sealed class GetHomeworkSubmissionQueryHandler : IRequestHandler<GetHomeworkSubmissionQuery, HomeworkSubmissionDetailDto>
{
    private readonly IClassRepository _classRepository;
    private readonly IChallengeRepository _challengeRepository;
    private readonly IQuizSetRepository _quizSetRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetHomeworkSubmissionQueryHandler(
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

    public async Task<HomeworkSubmissionDetailDto> Handle(
        GetHomeworkSubmissionQuery request,
        CancellationToken cancellationToken)
    {
        // Get current user ID
        var userIdString = _currentUserService.UserId
            ?? throw new UnauthorizedException("Người dùng chưa đăng nhập");

        if (!Guid.TryParse(userIdString, out var userId))
            throw new UnauthorizedException("ID người dùng không hợp lệ");

        // Get class and homework using specification
        var classSpec = new ClassWithHomeworkAndSubmissionsSpec(request.HomeworkId);
        var classEntity = await _classRepository.GetBySpecAsync(classSpec, cancellationToken);
        if (classEntity == null)
        {
            throw new EntityNotFoundException("Bài tập về nhà", request.HomeworkId);
        }

        var homework = classEntity.Homeworks.FirstOrDefault(h => h.Id == request.HomeworkId && h.DeletedAt == null);
        if (homework == null)
        {
            throw new EntityNotFoundException("Bài tập về nhà", request.HomeworkId);
        }

        // Verify class ID matches
        if (classEntity.Id != request.ClassId)
        {
            throw new ValidationException("Class ID không khớp với homework");
        }

        // Determine which student's submission to fetch
        Guid targetStudentId;
        
        if (request.StudentId.HasValue)
        {
            // Teacher is requesting a specific student's submission
            // Verify the current user is the teacher of this class
            if (classEntity.TeacherId != userId)
            {
                throw new UnauthorizedException("Chỉ giáo viên của lớp mới có thể xem bài nộp của học sinh khác");
            }
            targetStudentId = request.StudentId.Value;
        }
        else
        {
            // Student is requesting their own submission
            targetStudentId = userId;
        }

        // Find submission for target student
        var submission = homework.Submissions.FirstOrDefault(s => s.StudentId == targetStudentId);
        if (submission == null)
        {
            throw new EntityNotFoundException("Bài nộp của học sinh cho bài tập", $"{targetStudentId}/{request.HomeworkId}");
        }

        // Load challenge attempt with answers
        var spec = new ChallengeByAttemptIdSpec(submission.ChallengeAttemptId);
        var challenge = await _challengeRepository.GetBySpecAsync(spec, cancellationToken)
            ?? throw new EntityNotFoundException("Thử thách", submission.ChallengeAttemptId);

        var attempt = challenge.Attempts.FirstOrDefault(a => a.Id == submission.ChallengeAttemptId)
            ?? throw new EntityNotFoundException("Lượt chơi", submission.ChallengeAttemptId);

        // Load quiz set and questions
        var quizSet = await _quizSetRepository.GetByIdAsync(homework.QuizSetId, cancellationToken)
            ?? throw new EntityNotFoundException("Bộ câu hỏi", homework.QuizSetId);

        var questions = quizSet.Questions
            .Where(q => q.DeletedAt == null)
            .OrderBy(q => q.DisplayOrder)
            .ToList();

        // Map to DTOs
        var submissionDto = submission.Adapt<HomeworkSubmissionDto>();
        var homeworkDto = homework.Adapt<HomeworkDto>();
        homeworkDto.SubmissionCount = homework.Submissions.Count;
        homeworkDto.IsOverdue = homework.IsOverdue;
        homeworkDto.QuizSetTitle = quizSet.Title;

        // Load student name
        var student = await _userRepository.GetByIdAsync(submission.StudentId, cancellationToken);
        if (student != null)
        {
            submissionDto.StudentName = student.GetFullName();
        }

        // Map attempt with questions and show correct answers
        var attemptDto = attempt.Adapt<ChallengeAttemptDto>();
        attemptDto.Questions = questions.Select(q =>
        {
            var questionDto = q.Adapt<ChallengeQuestionDto>();

            // Find student's answer for this question
            var studentAnswer = attempt.Answers.FirstOrDefault(a => a.QuestionId == q.Id);

            // Create student answer DTO
            if (studentAnswer != null)
            {
                questionDto.StudentAnswer = new StudentAnswerDto
                {
                    AnswerId = studentAnswer.Id,
                    IsCorrect = studentAnswer.IsCorrect,
                    PointsEarned = studentAnswer.PointsEarned,
                    SubmissionTimeMs = studentAnswer.SubmissionTimeMs,
                    SelectedOptionIndexes = studentAnswer.SelectedOptionIndexes?.ToList(),
                    MatchingPairs = studentAnswer.MatchingPairs?.Select(mp => new AnswerMatchingPairDto
                    {
                        LeftContent = mp.LeftContent,
                        RightContent = mp.RightContent
                    }).ToList(),
                    OrderingItems = studentAnswer.OrderingItems?.Select(oi => new AnswerOrderingItemDto
                    {
                        Content = oi.Content,
                        Position = oi.Position
                    }).ToList()
                };
            }

            // Handle different question types
            switch (q.Type)
            {
                case QuestionType.SingleChoice:
                case QuestionType.TrueFalse:
                case QuestionType.MultipleChoice:
                    // Show correct answers
                    if (questionDto.Options != null)
                    {
                        foreach (var option in questionDto.Options)
                        {
                            var optionIndex = option.DisplayOrder - 1; // Assuming DisplayOrder is 1-based
                            var srcOption = q.Options.FirstOrDefault(o => o.Content == option.Content && o.DisplayOrder == option.DisplayOrder);
                            if (srcOption != null)
                            {
                                option.IsCorrect = srcOption.IsCorrect;
                            }
                        }
                    }
                    break;

                case QuestionType.Matching:
                    // For matching questions, the correct pairs are already in questionDto.MatchingPairs
                    // The student's answers are in questionDto.StudentAnswer.MatchingPairs
                    break;

                case QuestionType.Ordering:
                    // Show correct ordering positions
                    if (questionDto.OrderingItems != null)
                    {
                        foreach (var item in questionDto.OrderingItems)
                        {
                            var srcItem = q.OrderingItems.FirstOrDefault(i => i.Content == item.Content);
                            if (srcItem != null)
                            {
                                item.CorrectPosition = srcItem.CorrectPosition;
                            }
                        }
                    }
                    break;

                case QuestionType.Video:
                case QuestionType.Audio:
                    // Video and Audio questions don't have answer options
                    // They display the media content and may have text-based answers
                    // The content is already included in the DTO
                    break;
            }

            return questionDto;
        }).ToList();

        return new HomeworkSubmissionDetailDto
        {
            Submission = submissionDto,
            Attempt = attemptDto,
            Homework = homeworkDto
        };
    }
}

