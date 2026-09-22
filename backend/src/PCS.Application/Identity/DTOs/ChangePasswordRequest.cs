namespace PCS.Application.Identity.DTOs;

public sealed class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = "";

    public string NewPassword { get; set; } = "";
}