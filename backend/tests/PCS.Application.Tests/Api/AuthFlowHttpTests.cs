using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using PCS.Application.Identity.DTOs;

namespace PCS.Application.Tests.Api;

/// <summary>The session lifecycle end to end through HTTP.</summary>
[Collection(ApiCollection.Name)]
public sealed class AuthFlowHttpTests
{
    private readonly PcsApiFactory _factory;

    public AuthFlowHttpTests(PcsApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Repeated_wrong_passwords_lock_the_account_even_for_the_right_password()
    {
        await _factory.SeedAsync();
        HttpClient client = _factory.CreateClient();

        // The factory sets the threshold to 3.
        for (int i = 0; i < 3; i++)
        {
            Assert.Equal(
                HttpStatusCode.Unauthorized,
                (await Login(client, "locky", "Wrong-Passw0rd!")).StatusCode);
        }

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await Login(client, "locky", PcsApiFactory.Password)).StatusCode);
    }

    [Fact]
    public async Task Refresh_rotates_tokens_and_logout_ends_the_session()
    {
        var (client, login) = await ApiTestClient.LoginAsync(_factory, "refresher");

        Assert.False(string.IsNullOrEmpty(login.RefreshToken));

        HttpResponseMessage refreshed = await client.PostAsJsonAsync(
            "/api/auth/refresh",
            new RefreshRequest { RefreshToken = login.RefreshToken!, CompanyId = login.ActiveCompanyId });

        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        LoginResponse next = (await refreshed.Content.ReadFromJsonAsync<LoginResponse>())!;

        Assert.NotEqual(login.RefreshToken, next.RefreshToken);
        Assert.Equal(login.ActiveCompanyId, next.ActiveCompanyId);

        // The new access token works.
        var authed = _factory.CreateClient();
        authed.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", next.Token);
        Assert.Equal(HttpStatusCode.OK, (await authed.GetAsync("/api/projects")).StatusCode);

        // Logout with the current token, then it can no longer be used.
        Assert.Equal(
            HttpStatusCode.NoContent,
            (await client.PostAsJsonAsync("/api/auth/logout", new LogoutRequest { RefreshToken = next.RefreshToken })).StatusCode);

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await client.PostAsJsonAsync(
                "/api/auth/refresh",
                new RefreshRequest { RefreshToken = next.RefreshToken!, CompanyId = login.ActiveCompanyId })).StatusCode);
    }

    [Fact]
    public async Task Forgotten_password_can_be_reset_with_the_emailed_code()
    {
        await _factory.SeedAsync();
        HttpClient client = _factory.CreateClient();

        // Unknown accounts get the same answer as known ones.
        Assert.Equal(
            HttpStatusCode.OK,
            (await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest { Identifier = "nobody@nowhere.example" })).StatusCode);

        int before = _factory.Mail.Sent.Count;

        Assert.Equal(
            HttpStatusCode.OK,
            (await client.PostAsJsonAsync("/api/auth/forgot-password", new ForgotPasswordRequest { Identifier = "forgetful@a.example" })).StatusCode);

        var mail = _factory.Mail.Sent.Skip(before).Single();
        Assert.Equal("forgetful@a.example", mail.To);

        string code = Regex.Match(mail.Body, "[A-Z2-9]{4}-[A-Z2-9]{4}").Value;
        const string newPassword = "Reset-Passw0rd-2026";

        Assert.Equal(
            HttpStatusCode.OK,
            (await client.PostAsJsonAsync(
                "/api/auth/reset-password",
                new ResetPasswordRequest { Identifier = "forgetful", Code = code, NewPassword = newPassword })).StatusCode);

        Assert.Equal(HttpStatusCode.OK, (await Login(client, "forgetful@a.example", newPassword)).StatusCode);
    }

    private static Task<HttpResponseMessage> Login(HttpClient client, string userName, string password) =>
        client.PostAsJsonAsync(
            "/api/auth/login",
            new LoginRequest { Username = userName, Password = password });
}
