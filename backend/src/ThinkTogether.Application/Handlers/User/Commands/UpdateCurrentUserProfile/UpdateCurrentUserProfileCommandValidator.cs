using FluentValidation;

namespace ThinkTogether.Application.Handlers.User.Commands.UpdateCurrentUserProfile;

public sealed class UpdateCurrentUserProfileCommandValidator : AbstractValidator<UpdateCurrentUserProfileCommand>
{
    public UpdateCurrentUserProfileCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Tên đệm là bắt buộc")
            .MaximumLength(100).WithMessage("Tên đệm không được vượt quá 100 ký tự");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Tên gọi là bắt buộc")
            .MaximumLength(100).WithMessage("Tên gọi không được vượt quá 100 ký tự");

        RuleFor(x => x.Bio)
            .MaximumLength(500).WithMessage("Tiểu sử không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.Bio));

        RuleFor(x => x.AvatarUrl)
            .MaximumLength(500).WithMessage("URL ảnh đại diện quá dài")
            .Must(url => url == null || Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("URL ảnh đại diện không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.AvatarUrl));
    }
}
