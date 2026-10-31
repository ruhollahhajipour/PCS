using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Services;
using Xunit;

namespace PCS.Application.Tests.Planning;

public sealed class WbsCalculationServiceTests
{
    [Fact]
    public void Calculate_RollsUpByParentIdRegardlessOfLevelAndInputOrder()
    {
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();
        var leafId = Guid.NewGuid();

        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = leafId,
                ParentId = childId,
                Code = "01.01.01",
                Level = 2
            },
            new()
            {
                Id = rootId,
                Code = "01",
                Level = 1
            },
            new()
            {
                Id = childId,
                ParentId = rootId,
                Code = "01.01",
                Level = 3
            }
        };

        var activities = new List<ActivityDto>
        {
            new()
            {
                Code = "ACT-001",
                WbsNodeId = leafId,
                WbsCode = "stale-display-code",
                Budget = 120m,
                ActualCost = 30m,
                EarnedValue = 60m,
                PlannedValue = 70m,
                Progress = 50m
            }
        };

        var result = new WbsCalculationService().Calculate(nodes, activities);

        var root = Assert.Single(result, node => node.Id == rootId);
        var child = Assert.Single(result, node => node.Id == childId);
        var leaf = Assert.Single(result, node => node.Id == leafId);

        Assert.Equal(120m, root.Budget);
        Assert.Equal(120m, child.Budget);
        Assert.Equal(120m, leaf.Budget);
        Assert.Equal(30m, root.ActualCost);
        Assert.Equal(60m, root.EarnedValue);
        Assert.Equal(70m, root.PlannedValue);
        Assert.Equal(50m, root.Progress);
        Assert.Equal(50m, child.Progress);
        Assert.Equal(50m, leaf.Progress);
        Assert.Equal(100m, root.WeightValue);
        Assert.Equal(100m, child.WeightFactor);
        Assert.Equal(100m, leaf.WeightFactor);
    }

    [Fact]
    public void Calculate_RejectsActivityWithoutPersistedWbsId()
    {
        var nodes = new List<WbsNodeDto>
        {
            new() { Id = Guid.NewGuid(), Code = "01" }
        };
        var activities = new List<ActivityDto>
        {
            new() { Code = "ACT-001", WbsCode = "01" }
        };

        var exception = Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(nodes, activities));

        Assert.Contains("ACT-001", exception.Message);
    }

    [Fact]
    public void Calculate_RejectsMissingParentInsteadOfSilentlyTreatingNodeAsRoot()
    {
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                ParentId = Guid.NewGuid(),
                Code = "01.01"
            }
        };

        var exception = Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(nodes, []));

        Assert.Contains("missing parent", exception.Message);
    }

    [Fact]
    public void Calculate_RejectsParentCycle()
    {
        var firstId = Guid.NewGuid();
        var secondId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new() { Id = firstId, ParentId = secondId, Code = "01" },
            new() { Id = secondId, ParentId = firstId, Code = "01.01" }
        };

        var exception = Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(nodes, []));

        Assert.Contains("cycle", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Calculate_ReturnsZeroWeightsAndProgressWhenProjectBudgetIsZero()
    {
        var wbsId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new() { Id = wbsId, Code = "01", Budget = 500m, Progress = 80m }
        };
        var activities = new List<ActivityDto>
        {
            new()
            {
                Code = "ACT-001",
                WbsNodeId = wbsId,
                Budget = 0m,
                Progress = 80m
            }
        };

        var result = new WbsCalculationService().Calculate(nodes, activities);

        Assert.Equal(0m, result[0].Budget);
        Assert.Equal(0m, result[0].WeightValue);
        Assert.Equal(0m, result[0].Progress);
    }

    [Fact]
    public void Calculate_RejectsActivitiesWhenNoWbsNodesExist()
    {
        var activities = new List<ActivityDto>
        {
            new() { Code = "ACT-001", WbsNodeId = Guid.NewGuid() }
        };

        Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate([], activities));
    }
}
