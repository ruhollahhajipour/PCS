using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class DocumentFolder : AuditableEntity
{
    public string Name { get; set; } = "";

    public Guid? ParentId { get; set; }

    public DocumentFolder? Parent { get; set; }

    public ICollection<DocumentFolder> Children
        = new List<DocumentFolder>();
}