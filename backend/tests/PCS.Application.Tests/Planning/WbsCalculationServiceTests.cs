using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Services;
using Xunit;

namespace PCS.Application.Tests.Planning;

public sealed class WbsCalculationServiceTests
{
    [Fact]
    public void Calculate_AssignsActivityByWbsNodeId_WhenWbsCodesAreNotUnique()
    {
        var firstWbsId = Guid.NewGuid();
        var assignedWbsId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = firstWbsId,
                Code = "01",
                Name = "First package",
                Level = 1
            },
            new()
            {
                Id = assignedWbsId,
                Code = "01",
                Name = "Second package",
                Level = 1
            }
        };
        var activities = new List<ActivityDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                WbsNodeId = assignedWbsId,
                WbsCode = "01",
                Code = "ACT-001",
                Budget = 100m,
                ActualCost = 25m,
                EarnedValue = 50m,
                PlannedValue = 60m,
                Progress = 50m
            }
        };

        new WbsCalculationService().Calculate(nodes, activities);

        Assert.Equal(0m, nodes[0].Budget);
        Assert.Equal(100m, nodes[1].Budget);
        Assert.Equal(25m, nodes[1].ActualCost);
        Assert.Equal(50m, nodes[1].EarnedValue);
        Assert.Equal(60m, nodes[1].PlannedValue);
        Assert.Equal(50m, nodes[1].Progress);
    }

    [Fact]
    public void Calculate_RollsActivityValuesUpThroughWbsAncestors()
    {
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = rootId,
                Code = "01",
                Name = "Engineering",
                Level = 1
            },
            new()
            {
                Id = childId,
                ParentId = rootId,
                Code = "01.01",
                Name = "Design",
                Level = 2
            }
        };
        var activities = new List<ActivityDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                WbsNodeId = childId,
                WbsCode = "01.01",
                Code = "ACT-001",
                Budget = 200m,
                ActualCost = 80m,
                EarnedValue = 100m,
                PlannedValue = 120m,
                Progress = 50m
            }
        };

        new WbsCalculationService().Calculate(nodes, activities);

        var root = Assert.Single(nodes.Where(x => x.Id == rootId));
        var child = Assert.Single(nodes.Where(x => x.Id == childId));

        Assert.Equal(200m, root.Budget);
        Assert.Equal(80m, root.ActualCost);
        Assert.Equal(100m, root.EarnedValue);
        Assert.Equal(120m, root.PlannedValue);
        Assert.Equal(50m, root.Progress);
        Assert.Equal(200m, child.Budget);
        Assert.Equal(50m, child.Progress);
        Assert.Equal(100m, child.WeightFactor);
    }
}
