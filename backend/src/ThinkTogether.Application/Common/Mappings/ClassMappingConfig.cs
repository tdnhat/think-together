using Mapster;
using ThinkTogether.Application.DTOs;
using ThinkTogether.Domain.Aggregates.ClassAggregate;
using ThinkTogether.Domain.Aggregates.ClassAggregate.Entities;

namespace ThinkTogether.Application.Common.Mappings;

public sealed class ClassMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // Class -> ClassDto
        config.NewConfig<Class, ClassDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.TeacherId, src => src.TeacherId)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.JoinCode, src => src.JoinCode)
            .Map(dest => dest.CoverImageUrl, src => src.CoverImageUrl)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt)
            .Map(dest => dest.MemberCount, src => src.Members.Count(m => m.LeftAt == null))
            .Map(dest => dest.HomeworkCount, src => src.Homeworks.Count)
            .Map(dest => dest.TeacherName, src => (string?)null!); // Will be set manually from User repository

        // Class -> ClassDetailDto
        config.NewConfig<Class, ClassDetailDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.TeacherId, src => src.TeacherId)
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Description, src => src.Description)
            .Map(dest => dest.JoinCode, src => src.JoinCode)
            .Map(dest => dest.CoverImageUrl, src => src.CoverImageUrl)
            .Map(dest => dest.CreatedAt, src => src.CreatedAt)
            .Map(dest => dest.UpdatedAt, src => src.UpdatedAt)
            .Map(dest => dest.MemberCount, src => src.Members.Count(m => m.LeftAt == null))
            .Map(dest => dest.HomeworkCount, src => src.Homeworks.Count)
            .Map(dest => dest.TeacherName, src => (string?)null!) // Will be set manually from User repository
            .Map(dest => dest.Members, src => src.Members.Where(m => m.LeftAt == null).Adapt<List<ClassMemberDto>>())
            .Map(dest => dest.Homeworks, src => src.Homeworks.Where(h => h.DeletedAt == null).Adapt<List<HomeworkDto>>());

        // ClassMember -> ClassMemberDto
        config.NewConfig<ClassMember, ClassMemberDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.ClassId, src => src.ClassId)
            .Map(dest => dest.UserId, src => src.UserId)
            .Map(dest => dest.JoinedAt, src => src.JoinedAt)
            .Map(dest => dest.LeftAt, src => src.LeftAt)
            .Map(dest => dest.UserName, src => (string?)null!) // Will be set manually from User repository
            .Map(dest => dest.UserEmail, src => (string?)null!); // Will be set manually from User repository

        // Homework -> HomeworkDto
        config.NewConfig<Homework, HomeworkDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.ClassId, src => src.ClassId)
            .Map(dest => dest.QuizSetId, src => src.QuizSetId)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.DueDate, src => src.DueDate)
            .Map(dest => dest.AssignedAt, src => src.AssignedAt)
            .Map(dest => dest.SubmissionCount, src => src.Submissions.Count)
            .Map(dest => dest.IsOverdue, src => src.IsOverdue)
            .Map(dest => dest.QuizSetTitle, src => (string?)null!); // Will be set manually from QuizSet repository

        // Homework -> HomeworkDetailDto
        config.NewConfig<Homework, HomeworkDetailDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.ClassId, src => src.ClassId)
            .Map(dest => dest.QuizSetId, src => src.QuizSetId)
            .Map(dest => dest.Title, src => src.Title)
            .Map(dest => dest.DueDate, src => src.DueDate)
            .Map(dest => dest.AssignedAt, src => src.AssignedAt)
            .Map(dest => dest.SubmissionCount, src => src.Submissions.Count)
            .Map(dest => dest.IsOverdue, src => src.IsOverdue)
            .Map(dest => dest.QuizSetTitle, src => (string?)null!) // Will be set manually from QuizSet repository
            .Map(dest => dest.Submissions, src => src.Submissions.Adapt<List<HomeworkSubmissionDto>>());

        // HomeworkSubmission -> HomeworkSubmissionDto
        config.NewConfig<HomeworkSubmission, HomeworkSubmissionDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.HomeworkId, src => src.HomeworkId)
            .Map(dest => dest.StudentId, src => src.StudentId)
            .Map(dest => dest.ChallengeAttemptId, src => src.ChallengeAttemptId)
            .Map(dest => dest.Score, src => src.Score)
            .Map(dest => dest.SubmittedAt, src => src.SubmittedAt)
            .Map(dest => dest.Status, src => src.Status)
            .Map(dest => dest.StudentName, src => (string?)null!); // Will be set manually from User repository
    }
}

