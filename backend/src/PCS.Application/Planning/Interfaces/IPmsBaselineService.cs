using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsBaselineService
{
    Task<ProjectBaselineSnapshotDto> CreateDraftAsync(
        Guid projectId,
        CreateProjectBaselineDto request,
        string? createdBy);

    Task<ProjectBaselineDto> ApproveAsync(
        Guid projectId,
        Guid baselineId,
        string? approvedBy);

    Task<IReadOnlyList<ProjectBaselineDto>> GetAllAsync(
        Guid projectId);

    Task<ProjectBaselineSnapshotDto?> GetActiveSnapshotAsync(
        Guid projectId);

    Task<ProjectBaselineSnapshotDto?> GetSnapshotForDateAsync(
        Guid projectId,
        DateTime dataDate);
}
