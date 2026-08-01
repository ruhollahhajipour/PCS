using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface IPmsEvmService
{
    Task<EvmResultDto> CalculateAsync(
        Guid projectId,
        DateTime reportDate);
}