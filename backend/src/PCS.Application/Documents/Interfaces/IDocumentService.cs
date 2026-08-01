using PCS.Domain.Entities;

namespace PCS.Application.Documents.Interfaces;

public interface IDocumentService
{
    Task<Guid> UploadAsync(
        Document document,
        Stream stream);

    Task<Stream> DownloadAsync(
        Guid id);

    Task DeleteAsync(
        Guid id);

    Task<List<Document>> GetByEntityAsync(
        string module,
        Guid entityId);
}