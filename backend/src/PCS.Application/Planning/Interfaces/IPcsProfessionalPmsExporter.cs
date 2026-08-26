using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Interfaces;

public interface IPcsProfessionalPmsExporter
{
    Task<byte[]> GenerateAsync(
        ExportPmsDto dto);
}