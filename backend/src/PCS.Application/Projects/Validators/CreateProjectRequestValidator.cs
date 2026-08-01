using FluentValidation;
using PCS.Application.Projects.DTOs;

namespace PCS.Application.Projects.Validators;

public sealed class CreateProjectRequestValidator
    : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.ShortName)
            .MaximumLength(50);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.CompanyId)
            .NotEqual(Guid.Empty);

        RuleFor(x => x.Currency)
            .NotEmpty()
            .Length(3);

        RuleFor(x => x.Budget)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.ActualCost)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Progress)
            .InclusiveBetween(0, 100);

        RuleFor(x => x.SPI)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.CPI)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.StartDate)
            .NotEmpty();

        RuleFor(x => x.FinishDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .When(x => x.FinishDate.HasValue);

        RuleFor(x => x.Status)
            .Must(status =>
                string.IsNullOrWhiteSpace(status) ||
                status is "Active"
                    or "Completed"
                    or "Delayed"
                    or "Cancelled")
            .WithMessage("Invalid project status.");
    }
}