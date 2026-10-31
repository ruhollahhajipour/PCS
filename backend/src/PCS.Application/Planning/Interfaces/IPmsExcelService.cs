using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsExcelService
{
    Task<ImportPmsDto> ReadPmsExcelAsync(
        string filePath
    );


    Task<byte[]> GeneratePmsExcelAsync(
        ExportPmsDto dto
    );
}
