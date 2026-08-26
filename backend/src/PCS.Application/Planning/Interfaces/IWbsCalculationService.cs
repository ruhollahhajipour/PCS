using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IWbsCalculationService
{
    List<WbsNodeDto> Calculate(
        List<WbsNodeDto> nodes,
        List<ActivityDto> activities);
}