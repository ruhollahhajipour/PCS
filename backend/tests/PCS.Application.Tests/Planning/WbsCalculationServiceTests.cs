using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Services;

namespace PCS.Application.Tests.Planning;

public sealed class WbsCalculationServiceTests
{
    [Fact]
    public void Calculate_UsesWbsNodeIdAndRollsUpActivityValues()
    {
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = rootId,
                Code = "01",
                Name = "Project",
                Level = 1
            },
            new()
            {
                Id = childId,
                ParentId = rootId,
                Code = "01.01",
                Name = "Engineering",
                Level = 2
            }
        };

        var activities = new List<ActivityDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Code = "A-001",
                WbsNodeId = childId,
                WbsCode = "STALE-CODE",
                Budget = 100m,
                ActualCost = 40m,
                EarnedValue = 50m,
                PlannedValue = 75m,
                Progress = 50m
            },
            new()
            {
                Id = Guid.NewGuid(),
                Code = "A-002",
                WbsNodeId = childId,
                WbsCode = "ALSO-STALE",
                Budget = 300m,
                ActualCost = 60m,
                EarnedValue = 150m,
                PlannedValue = 125m,
                Progress = 100m
            }
        };

        var result = new WbsCalculationService().Calculate(nodes, activities);

        var root = Assert.Single(result, x => x.Id == rootId);
        var child = Assert.Single(result, x => x.Id == childId);

        Assert.Equal(400m, child.Budget);
        Assert.Equal(100m, child.ActualCost);
        Assert.Equal(200m, child.EarnedValue);
        Assert.Equal(200m, child.PlannedValue);
        Assert.Equal(87.5m, child.Progress);
        Assert.Equal(100m, child.WeightFactor);
        Assert.Equal(100m, child.WeightValue);

        Assert.Equal(400m, root.Budget);
        Assert.Equal(100m, root.ActualCost);
        Assert.Equal(200m, root.EarnedValue);
        Assert.Equal(200m, root.PlannedValue);
        Assert.Equal(87.5m, root.Progress);
        Assert.Equal(100m, root.WeightValue);
    }

    [Fact]
    public void Calculate_RollsUpByParentIdWhenStoredLevelsAreInconsistent()
    {
        var rootId = Guid.NewGuid();
        var childId = Guid.NewGuid();
        var leafId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
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
            },
            new()
            {
                Id = leafId,
                ParentId = childId,
                Code = "01.01.01",
                Level = 2
            }
        };
        var activities = new List<ActivityDto>
        {
            new()
            {
                Code = "A-LEAF",
                WbsNodeId = leafId,
                Budget = 120m,
                Progress = 50m
            }
        };

        var result = new WbsCalculationService().Calculate(nodes, activities);

        var root = Assert.Single(result, node => node.Id == rootId);
        var child = Assert.Single(result, node => node.Id == childId);
        var leaf = Assert.Single(result, node => node.Id == leafId);

        Assert.Equal(120m, leaf.Budget);
        Assert.Equal(120m, child.Budget);
        Assert.Equal(120m, root.Budget);
        Assert.Equal(50m, leaf.Progress);
        Assert.Equal(50m, child.Progress);
        Assert.Equal(50m, root.Progress);
        Assert.Equal(100m, root.WeightValue);
    }

    [Fact]
    public void Calculate_ThrowsWhenWbsHierarchyContainsCycle()
    {
        var firstId = Guid.NewGuid();
        var secondId = Guid.NewGuid();
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = firstId,
                ParentId = secondId,
                Code = "01"
            },
            new()
            {
                Id = secondId,
                ParentId = firstId,
                Code = "01.01"
            }
        };

        var exception = Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(
                nodes,
                new List<ActivityDto>()));

        Assert.Contains("cycle", exception.Message.ToLowerInvariant());
    }

    [Fact]
    public void Calculate_ThrowsWhenActivityReferencesUnknownWbsNode()
    {
        var nodes = new List<WbsNodeDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Code = "01",
                Level = 1
            }
        };
        var activities = new List<ActivityDto>
        {
            new()
            {
                Code = "A-404",
                WbsNodeId = Guid.NewGuid(),
                WbsCode = "01"
            }
        };

        var exception = Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(nodes, activities));

        Assert.Contains("A-404", exception.Message);
    }

    [Fact]
    public void Calculate_ReturnsEmptyWhenThereAreNoNodesOrActivities()
    {
        var result = new WbsCalculationService().Calculate(
            new List<WbsNodeDto>(),
            new List<ActivityDto>());

        Assert.Empty(result);
    }

    [Fact]
    public void Calculate_ThrowsWhenActivitiesExistWithoutWbsNodes()
    {
        var activities = new List<ActivityDto>
        {
            new()
            {
                Code = "A-001",
                WbsNodeId = Guid.NewGuid()
            }
        };

        Assert.Throws<InvalidOperationException>(
            () => new WbsCalculationService().Calculate(
                new List<WbsNodeDto>(),
                activities));
    }
}
