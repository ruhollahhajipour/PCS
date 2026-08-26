using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsEvmService
{
    Task<EvmResultDto> CalculateAsync(
        Guid projectId,
        DateTime reportDate);
}
