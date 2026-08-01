using PCS.Application.Projects.DTOs;

namespace PCS.Application.Projects.Commands.Update;

public sealed record UpdateProjectCommand(
    Guid Id,
    CreateProjectDto Project);