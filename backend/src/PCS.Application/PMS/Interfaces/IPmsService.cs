using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

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