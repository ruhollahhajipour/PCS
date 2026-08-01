using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class Document : AuditableEntity
{
    public string Name { get; set; } = "";

    public string FileName { get; set; } = "";

    public string Extension { get; set; } = "";

    public string ContentType { get; set; } = "";

    public long Size { get; set; }

    public string Path { get; set; } = "";

    public string Module { get; set; } = "";

    public Guid EntityId { get; set; }

    public int Version { get; set; } = 1;

    public bool IsLatest { get; set; } = true;

    public string? Description { get; set; }
}