using System.Globalization;
using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Services;

namespace PCS.Application.Tests.Planning;

public sealed class PmsBaselineCalculatorTests
{
    private static readonly int MondayToFridayMask =
        (1 << (int)DayOfWeek.Monday) |
        (1 << (int)DayOfWeek.Tuesday) |
        (1 << (int)DayOfWeek.Wednesday) |
        (1 << (int)DayOfWeek.Thursday) |
        (1 << (int)DayOfWeek.Friday);

    [Theory]
    [InlineData("2026-10-25", 0)] // Before the Monday start.
    [InlineData("2026-10-26", 200)]
    [InlineData("2026-10-28", 600)]
    [InlineData("2026-10-30", 1000)]
    [InlineData("2026-11-01", 1000)] // After finish.
    public void CalculateActivityPlannedValue_DistributesBudgetAcrossWorkingDays(
        string statusDate,
        decimal expected)
    {
        var activity = CreateActivity(
            budget: 1000m,
            start: new DateTime(2026, 10, 26),
            finish: new DateTime(2026, 10, 30));

        var result = PmsBaselineCalculator.CalculateActivityPlannedValue(
            activity,
            DateTime.ParseExact(statusDate, "yyyy-MM-dd", CultureInfo.InvariantCulture));

        Assert.Equal(expected, result);
    }

    [Fact]
    public void CalculateActivityPlannedValue_DoesNotAdvanceOnNonWorkingDay()
    {
        var activity = CreateActivity(
            budget: 1000m,
            start: new DateTime(2026, 10, 26),
            finish: new DateTime(2026, 10, 30));

        var friday = PmsBaselineCalculator.CalculateActivityPlannedValue(
            activity,
            new DateTime(2026, 10, 30));
        var saturday = PmsBaselineCalculator.CalculateActivityPlannedValue(
            activity,
            new DateTime(2026, 10, 31));

        Assert.Equal(1000m, friday);
        Assert.Equal(1000m, saturday);
    }

    [Fact]
    public void CalculateActivityPlannedValue_MilestoneEarnsBudgetOnlyOnOrAfterFinish()
    {
        var activity = CreateActivity(
            budget: 250m,
            start: new DateTime(2026, 10, 26),
            finish: new DateTime(2026, 10, 30),
            isMilestone: true);

        Assert.Equal(
            0m,
            PmsBaselineCalculator.CalculateActivityPlannedValue(
                activity,
                new DateTime(2026, 10, 29)));

        Assert.Equal(
            250m,
            PmsBaselineCalculator.CalculateActivityPlannedValue(
                activity,
                new DateTime(2026, 10, 30)));
    }

    [Theory]
    [InlineData("0")]
    [InlineData("-10")]
    public void CalculateActivityPlannedValue_ReturnsZeroForNonPositiveBudget(string budget)
    {
        var activity = CreateActivity(
            decimal.Parse(budget, CultureInfo.InvariantCulture),
            new DateTime(2026, 10, 26),
            new DateTime(2026, 10, 30));

        Assert.Equal(
            0m,
            PmsBaselineCalculator.CalculateActivityPlannedValue(
                activity,
                new DateTime(2026, 10, 28)));
    }

    [Fact]
    public void CalculateActivityPlannedValue_ReturnsZeroWhenDatesAreMissing()
    {
        var activity = CreateActivity(
            budget: 100m,
            start: null,
            finish: new DateTime(2026, 10, 30));

        Assert.Equal(
            0m,
            PmsBaselineCalculator.CalculateActivityPlannedValue(
                activity,
                new DateTime(2026, 10, 28)));
    }

    [Fact]
    public void CalculatePlannedValue_SumsActivities()
    {
        var activities = new[]
        {
            CreateActivity(100m, new DateTime(2026, 10, 26), new DateTime(2026, 10, 30)),
            CreateActivity(50m, new DateTime(2026, 10, 26), new DateTime(2026, 10, 30))
        };

        var result = PmsBaselineCalculator.CalculatePlannedValue(
            activities,
            new DateTime(2026, 10, 28));

        Assert.Equal(90m, result);
    }

    private static ProjectBaselineActivityDto CreateActivity(
        decimal budget,
        DateTime? start,
        DateTime? finish,
        bool isMilestone = false)
    {
        return new ProjectBaselineActivityDto
        {
            ActivityId = Guid.NewGuid(),
            Budget = budget,
            PlannedStart = start,
            PlannedFinish = finish,
            WorkingDaysMask = MondayToFridayMask,
            IsMilestone = isMilestone
        };
    }
}
