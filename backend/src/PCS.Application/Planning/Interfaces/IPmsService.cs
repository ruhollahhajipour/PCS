using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsTemplateService
{
    byte[] GenerateTemplate();
}


public interface IPmsService
{
    Task ImportPmsAsync(
        ImportPmsDto dto
    );


    Task<ExportPmsDto> ExportPmsAsync(
        Guid projectId
    );


    Task<List<WbsNodeDto>> GetWbsTreeAsync(
        Guid projectId
    );


    Task<List<ActivityDto>> GetActivitiesAsync(
        Guid projectId
    );
    
}
