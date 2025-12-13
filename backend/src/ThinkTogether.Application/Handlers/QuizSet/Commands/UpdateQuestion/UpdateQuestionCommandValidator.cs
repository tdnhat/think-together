using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UpdateQuestion;

public sealed class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand>
{
    public UpdateQuestionCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ trắc nghiệm là bắt buộc");

        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("ID câu hỏi là bắt buộc");

        RuleFor(x => x.Content)
            .MaximumLength(2000)
            .WithMessage("Nội dung câu hỏi không được vượt quá 2000 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Content));

        RuleFor(x => x.TimeLimit)
            .InclusiveBetween(1, 300)
            .WithMessage("Giới hạn thời gian phải từ 1 đến 300 giây")
            .When(x => x.TimeLimit.HasValue);

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Thứ tự hiển thị không được âm")
            .When(x => x.DisplayOrder.HasValue);

        // Validate options if provided
        When(x => x.Options != null && x.Options.Count > 0, () =>
        {
            RuleFor(x => x.Options)
                .Must(options => options!.Count >= 2)
                .WithMessage("Phải có ít nhất 2 lựa chọn")
                .Must(options => options!.Count <= 6)
                .WithMessage("Không được có quá 6 lựa chọn")
                .Must(options => options!.Any(o => o.IsCorrect))
                .WithMessage("Phải có ít nhất một đáp án đúng");

            RuleForEach(x => x.Options)
                .ChildRules(option =>
                {
                    option.RuleFor(o => o.Content)
                        .NotEmpty()
                        .WithMessage("Nội dung lựa chọn là bắt buộc")
                        .MaximumLength(1000)
                        .WithMessage("Nội dung lựa chọn không được vượt quá 1000 ký tự");
                });
        });

        // Validate matching pairs if provided
        When(x => x.MatchingPairs != null && x.MatchingPairs.Count > 0, () =>
        {
            RuleFor(x => x.MatchingPairs)
                .Must(pairs => pairs!.Count >= 2 && pairs.Count <= 5)
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
                });
        });

        // Validate ordering items if provided
        When(x => x.OrderingItems != null && x.OrderingItems.Count > 0, () =>
        {
            RuleFor(x => x.OrderingItems)
                .Must(items => items!.Count >= 3 && items.Count <= 6)
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
                });
        });

        // Validate video details if provided
        When(x => !string.IsNullOrEmpty(x.VideoUrl), () =>
        {
            RuleFor(x => x.VideoUrl)
                .MaximumLength(500)
                .WithMessage("URL video không được vượt quá 500 ký tự");

            RuleFor(x => x.VideoTimestamp)
                .NotNull()
                .WithMessage("Dấu thời gian video là bắt buộc khi có URL video")
                .GreaterThanOrEqualTo(0)
                .WithMessage("Dấu thời gian video không được âm");
        });

        // Validate audio details if provided
        When(x => !string.IsNullOrEmpty(x.AudioUrl), () =>
        {
            RuleFor(x => x.AudioUrl)
                .MaximumLength(500)
                .WithMessage("URL audio không được vượt quá 500 ký tự");

            RuleFor(x => x.AudioTimestamp)
                .NotNull()
                .WithMessage("Dấu thời gian audio là bắt buộc khi có URL audio")
                .GreaterThanOrEqualTo(0)
                .WithMessage("Dấu thời gian audio không được âm");
        });
    }
}

