using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class DocumentVersion : AuditableEntity
{
    public Guid DocumentId { get; set; }

    public Document Document { get; set; } = null!;

    public int Version { get; set; }

    public string FileName { get; set; } = "";

    public string StoragePath { get; set; } = "";

    public long Size { get; set; }

    public string UploadedBy { get; set; } = "";

    public DateTime UploadedAt { get; set; }
}