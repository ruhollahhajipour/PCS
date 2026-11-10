namespace PCS.Application.Identity.DTOs;

public class ForgotPasswordRequest
{
    /// <summary>User name or email address.</summary>
    public string Identifier { get; set; } = "";
}

public class ResetPasswordRequest
{
    public string Identifier { get; set; } = "";

    public string Code { get; set; } = "";

    public string NewPassword { get; set; } = "";
}

public class VerifyEmailRequest
{
    public string Code { get; set; } = "";
}
