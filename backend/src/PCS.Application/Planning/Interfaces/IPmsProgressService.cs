namespace PCS.Application.Planning.Interfaces;

public interface IPmsProgressService
{
    Task<decimal> CalculateWbsProgressAsync(
        Guid wbsNodeId);

    Task<decimal> CalculateProjectProgressAsync(
        Guid projectId);
}
