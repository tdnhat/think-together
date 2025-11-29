using FluentValidation;

namespace ThinkTogether.Application.Handlers.QuizSet.Commands.UploadCoverImage;

public sealed class UploadCoverImageCommandValidator : AbstractValidator<UploadCoverImageCommand>
{
    public UploadCoverImageCommandValidator()
    {
        RuleFor(x => x.QuizSetId)
            .NotEmpty()
            .WithMessage("ID bộ trắc nghiệm không được trống");

        RuleFor(x => x.CoverImage)
            .NotNull()
            .WithMessage("File ảnh không được trống");

        When(x => x.CoverImage != null, () =>
        {
            RuleFor(x => x.CoverImage.Length)
                .GreaterThan(0)
                .WithMessage("File ảnh không được trống");

            RuleFor(x => x.CoverImage.ContentType)
                .Must(contentType => 
                    new[] { "image/jpeg", "image/png", "image/webp", "image/gif" }
                    .Contains(contentType?.ToLower() ?? string.Empty))
                .WithMessage("Chỉ hỗ trợ các định dạng ảnh: JPEG, PNG, WebP, GIF");

            RuleFor(x => x.CoverImage.Length)
                .LessThanOrEqualTo(5 * 1024 * 1024) // 5MB
                .WithMessage("Kích thước file không được vượt quá 5MB");
        });
    }
}
