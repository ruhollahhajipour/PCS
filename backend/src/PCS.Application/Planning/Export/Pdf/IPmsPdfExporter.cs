using PCS.Application.Planning.DTOs;

namespace PCS.Application.Planning.Export.Pdf;

public interface IPmsPdfExporter
{
    byte[] Generate(ExportPmsDto dto);
}
