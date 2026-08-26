using PCS.Application.Planning.DTOs;
using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsCalculationService
{
    void CalculateActivities(
        IEnumerable<Activity> activities);


    void CalculateWbsRollup(
        IEnumerable<WbsNode> wbsNodes);


    ExportPmsDto CalculateProjectKpi(
        Guid projectId,
        IEnumerable<WbsNode> wbsNodes,
        IEnumerable<Activity> activities);
}