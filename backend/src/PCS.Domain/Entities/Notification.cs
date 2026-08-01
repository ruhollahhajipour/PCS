using PCS.Domain.Common;

namespace PCS.Domain.Entities;

public class Notification : AuditableEntity
{
    public Guid UserId { get; set; }

    public string Title { get; set; } = "";

    public string Message { get; set; } = "";

    public string Type { get; set; } = "Info";

    public bool IsRead { get; set; }

    public string? Url { get; set; }

    
}