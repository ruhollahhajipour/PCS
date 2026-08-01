namespace PCS.Application.Identity.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = "";

    public string Username { get; set; } = "";

    public string FullName { get; set; } = "";
}