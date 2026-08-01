using PCS.Application.Projects.DTOs;

namespace PCS.Application.Projects.Commands.Create;

public sealed record CreateProjectCommand(
    CreateProjectRequest Project);