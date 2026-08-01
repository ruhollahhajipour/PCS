using PCS.Application.PMS.DTOs;

namespace PCS.Application.PMS.Interfaces;

public interface IPmsExcelService
{
    Task<ImportPmsDto> ReadPmsExcelAsync(
        string filePath
    );


    Task<byte[]> GeneratePmsExcelAsync(
        ExportPmsDto dto
    );
}