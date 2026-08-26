using PCS.Domain.Common;

namespace PCS.Domain.Entities.Planning;

public class ProjectPhase : AuditableEntity
{
    public Guid ProjectId { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int Order { get; set; }

    public bool IsActive { get; set; } = true;
}
