namespace PCS.Application.Planning.DTOs;

public sealed class ReplaceActivityRelationshipsDto
{
    public List<ActivityPredecessorDto> Predecessors { get; set; } = new();
}

public sealed class ActivityPredecessorDto
{
    public Guid PredecessorId { get; set; }

    public string Type { get; set; } = "FS";

    public int Lag { get; set; }
}
