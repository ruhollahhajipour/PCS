using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPmsPdfExporter
{
    Task<byte[]> GenerateAsync(ExportPmsDto dto);
}
