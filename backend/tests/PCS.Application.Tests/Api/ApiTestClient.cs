using System.Net.Http.Headers;
using System.Net.Http.Json;
using PCS.Application.Identity.DTOs;

namespace PCS.Application.Tests.Api;

internal static class ApiTestClient
{
    public static async Task<(HttpClient Client, LoginResponse Login)> LoginAsync(
        PcsApiFactory factory,
        string userName,
        string password = PcsApiFactory.Password)
    {
        await factory.SeedAsync();

        HttpClient client = factory.CreateClient();

        // Logins are cached: the API limits sign-ins to 20 a minute per address
        // and every test would otherwise spend some of them.
        LoginResponse login = await factory.LoginCache.GetOrAddAsync(userName, async () =>
        {
            HttpResponseMessage response = await client.PostAsJsonAsync(
                "/api/auth/login",
                new LoginRequest { Username = userName, Password = password });

            Assert.True(
                response.IsSuccessStatusCode,
                $"Login of {userName} returned {(int)response.StatusCode}.");

            return (await response.Content.ReadFromJsonAsync<LoginResponse>())!;
        });

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", login.Token);

        return (client, login);
    }
}
