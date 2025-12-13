using FluentValidation;
using ThinkTogether.Domain.Aggregates.QuizSetAggregate.Entities;
using ThinkTogether.Domain.Enums;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.CreateQuestion;

public sealed class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
{
    public CreateQuestionCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ trắc nghiệm là bắt buộc");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Nội dung câu hỏi là bắt buộc")
            .MaximumLength(2000)
            .WithMessage("Nội dung câu hỏi không được vượt quá 2000 ký tự");

        RuleFor(x => x.TimeLimit)
            .InclusiveBetween(1, 300)
            .WithMessage("Giới hạn thời gian phải từ 1 đến 300 giây");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Thứ tự hiển thị không được âm");

        // Validate options for choice-based questions
        When(x => x.Type == QuestionType.SingleChoice || 
                  x.Type == QuestionType.TrueFalse || 
                  x.Type == QuestionType.MultipleChoice, () =>
        {
            RuleFor(x => x.Options)
                .NotNull()
                .WithMessage("Lựa chọn là bắt buộc cho câu hỏi trắc nghiệm")
                .Must(options => options != null && options.Count >= 2)
                .WithMessage("Phải có ít nhất 2 lựa chọn")
                .Must(options => options != null && options.Count <= 6)
                .WithMessage("Không được có quá 6 lựa chọn");

            RuleFor(x => x.Options)
                .Must(options => options != null && options.Any(o => o.IsCorrect))
                .WithMessage("Phải có ít nhất một đáp án đúng")
                .When(x => x.Options != null);

            RuleFor(x => x.Options)
                .Must(options => options != null && options.Count == 2)
                .WithMessage("Câu hỏi đúng/sai phải có đúng 2 lựa chọn")
                .When(x => x.Type == QuestionType.TrueFalse && x.Options != null);

            RuleFor(x => x.Options)
                .Must(options => options != null && options.Count(o => o.IsCorrect) == 1)
                .WithMessage("Câu hỏi một lựa chọn phải có đúng một đáp án đúng")
                .When(x => x.Type == QuestionType.SingleChoice && x.Options != null);

            RuleForEach(x => x.Options)
                .ChildRules(option =>
                {
                    option.RuleFor(o => o.Content)
                        .NotEmpty()
                        .WithMessage("Nội dung lựa chọn là bắt buộc")
                        .MaximumLength(1000)
                        .WithMessage("Nội dung lựa chọn không được vượt quá 1000 ký tự");

                    option.RuleFor(o => o.ImageUrl)
                        .MaximumLength(500)
                        .WithMessage("URL hình ảnh không được vượt quá 500 ký tự")
                        .When(o => !string.IsNullOrEmpty(o.ImageUrl));
                })
                .When(x => x.Options != null);
        });

        // Validate matching pairs
        When(x => x.Type == QuestionType.Matching, () =>
        {
            RuleFor(x => x.MatchingPairs)
                .NotNull()
                .WithMessage("Cặp ghép là bắt buộc cho câu hỏi ghép cặp")
                .Must(pairs => pairs != null && pairs.Count >= 2 && pairs.Count <= 5)
                .WithMessage("Số lượng cặp ghép phải từ 2 đến 5");

            RuleForEach(x => x.MatchingPairs)
                .ChildRules(pair =>
                {
                    pair.RuleFor(p => p.LeftContent)
                        .NotEmpty()
                        .WithMessage("Nội dung bên trái là bắt buộc")
                        .MaximumLength(500)
                        .WithMessage("Nội dung bên trái không được vượt quá 500 ký tự");

                    pair.RuleFor(p => p.RightContent)
                        .NotEmpty()
                        .WithMessage("Nội dung bên phải là bắt buộc")
                        .MaximumLength(500)
                        .WithMessage("Nội dung bên phải không được vượt quá 500 ký tự");
                })
                .When(x => x.MatchingPairs != null);
        });

        // Validate ordering items
        When(x => x.Type == QuestionType.Ordering, () =>
        {
            RuleFor(x => x.OrderingItems)
                .NotNull()
                .WithMessage("Mục sắp xếp là bắt buộc cho câu hỏi sắp xếp")
                .Must(items => items != null && items.Count >= 3 && items.Count <= 6)
                .WithMessage("Số lượng mục sắp xếp phải từ 3 đến 6");

            RuleForEach(x => x.OrderingItems)
                .ChildRules(item =>
                {
                    item.RuleFor(i => i.Content)
                        .NotEmpty()
                        .WithMessage("Nội dung mục sắp xếp là bắt buộc")
                        .MaximumLength(500)
                        .WithMessage("Nội dung mục sắp xếp không được vượt quá 500 ký tự");

                    item.RuleFor(i => i.CorrectPosition)
                        .GreaterThan(0)
                        .WithMessage("Vị trí đúng phải lớn hơn 0");
                })
                .When(x => x.OrderingItems != null);
        });

        // Validate video details
        When(x => x.Type == QuestionType.Video, () =>
        {
            RuleFor(x => x.VideoUrl)
                .NotEmpty()
                .WithMessage("URL video là bắt buộc cho câu hỏi video")
                .MaximumLength(500)
                .WithMessage("URL video không được vượt quá 500 ký tự");

            RuleFor(x => x.VideoTimestamp)
                .NotNull()
                .WithMessage("Dấu thời gian video là bắt buộc")
                .GreaterThanOrEqualTo(0)
                .WithMessage("Dấu thời gian video không được âm");
        });

        // Validate audio details
        When(x => x.Type == QuestionType.Audio, () =>
        {
            RuleFor(x => x.AudioUrl)
                .NotEmpty()
                .WithMessage("URL audio là bắt buộc cho câu hỏi audio")
                .MaximumLength(500)
                .WithMessage("URL audio không được vượt quá 500 ký tự");

            RuleFor(x => x.AudioTimestamp)
                .NotNull()
                .WithMessage("Dấu thời gian audio là bắt buộc")
                .GreaterThanOrEqualTo(0)
                .WithMessage("Dấu thời gian audio không được âm");
        });
    }
}

