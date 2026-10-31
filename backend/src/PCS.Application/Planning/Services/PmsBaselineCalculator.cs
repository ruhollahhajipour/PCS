using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Services;

/// <summary>
/// Calculates time-phased Planned Value from an approved, immutable activity baseline.
/// Distribution is linear across the captured working days; public holidays and shift exceptions
/// are not modeled because the current ProjectCalendar model does not contain those exceptions.
/// </summary>
public static class PmsBaselineCalculator
{
    public static decimal CalculatePlannedValue(
        IEnumerable<ProjectBaselineActivityDto> activities,
        DateTime statusDate)
    {
        var date = statusDate.Date;

        return Math.Round(
            activities.Sum(activity => CalculateActivityPlannedValue(activity, date)),
            2,
            MidpointRounding.AwayFromZero);
    }

    public static decimal CalculateActivityPlannedValue(
        ProjectBaselineActivityDto activity,
        DateTime statusDate)
    {
        if (activity.Budget <= 0m ||
            !activity.PlannedStart.HasValue ||
            !activity.PlannedFinish.HasValue)
        {
            return 0m;
        }

        var start = activity.PlannedStart.Value.Date;
        var finish = activity.PlannedFinish.Value.Date;
        var dataDate = statusDate.Date;

        if (dataDate < start)
            return 0m;

        if (activity.IsMilestone)
            return dataDate >= finish ? activity.Budget : 0m;

        if (dataDate >= finish)
            return activity.Budget;

        var totalWorkingDays = CountWorkingDays(
            start,
            finish,
            activity.WorkingDaysMask);

        if (totalWorkingDays <= 0)
            return 0m;

        var elapsedWorkingDays = CountWorkingDays(
            start,
            dataDate,
            activity.WorkingDaysMask);

        var earnedTimeFraction = Math.Clamp(
            (decimal)elapsedWorkingDays / totalWorkingDays,
            0m,
            1m);

        return Math.Round(
            activity.Budget * earnedTimeFraction,
            2,
            MidpointRounding.AwayFromZero);
    }

    private static int CountWorkingDays(
        DateTime start,
        DateTime finish,
        int workingDaysMask)
    {
        if (finish < start || workingDaysMask == 0)
            return 0;

        var count = 0;
        for (var date = start.Date; date <= finish.Date; date = date.AddDays(1))
        {
            if ((workingDaysMask & (1 << (int)date.DayOfWeek)) != 0)
                count++;
        }

        return count;
    }
}
