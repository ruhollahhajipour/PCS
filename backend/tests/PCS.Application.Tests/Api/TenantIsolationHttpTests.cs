using System.Net;
using System.Net.Http.Json;
using PCS.Application.Identity.DTOs;
using PCS.Application.Plants.DTOs;
using PCS.Application.Projects.DTOs;

namespace PCS.Application.Tests.Api;

/// <summary>
/// Cross-company access attempts through the real HTTP pipeline. A passing
/// test means the request was refused or invisible, not merely hidden by the UI.
/// </summary>
[Collection(ApiCollection.Name)]
public sealed class TenantIsolationHttpTests
{
    private readonly PcsApiFactory _factory;

    public TenantIsolationHttpTests(PcsApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Anonymous_requests_are_rejected()
    {
        await _factory.SeedAsync();

        HttpClient anonymous = _factory.CreateClient();

        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/projects")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/plants")).StatusCode);
    }

    [Fact]
    public async Task A_company_cannot_read_change_or_delete_another_companys_project()
    {
        var (alice, _) = await ApiTestClient.LoginAsync(_factory, "alice");
        var (bob, _) = await ApiTestClient.LoginAsync(_factory, "bob");

        Guid projectId = await CreateProjectAsync(alice, _factory.CompanyA, "ISO-READ");

        // Alice sees it; Bob does not, in the list or by id.
        Assert.Contains(await ListProjectsAsync(alice), x => x.Id == projectId);
        Assert.DoesNotContain(await ListProjectsAsync(bob), x => x.Id == projectId);
        Assert.Equal(HttpStatusCode.NotFound, (await bob.GetAsync($"/api/projects/{projectId}")).StatusCode);

        // Bob cannot update it, whichever company he claims in the body.
        foreach (Guid claimed in new[] { _factory.CompanyA, _factory.CompanyB })
        {
            HttpResponseMessage put = await bob.PutAsJsonAsync(
                $"/api/projects/{projectId}",
                NewProject(claimed, "ISO-READ", "Hijacked"));

            Assert.Equal(HttpStatusCode.NotFound, put.StatusCode);
        }

        // Nor delete it.
        Assert.Equal(HttpStatusCode.NotFound, (await bob.DeleteAsync($"/api/projects/{projectId}")).StatusCode);

        // The owner still sees it, unchanged.
        var stillThere = (await ListProjectsAsync(alice)).Single(x => x.Id == projectId);
        Assert.Equal("Project ISO-READ", stillThere.Name);
    }

    [Fact]
    public async Task A_company_cannot_create_a_project_inside_another_company()
    {
        var (alice, _) = await ApiTestClient.LoginAsync(_factory, "alice");
        var (bob, _) = await ApiTestClient.LoginAsync(_factory, "bob");

        HttpResponseMessage response = await bob.PostAsJsonAsync(
            "/api/projects",
            NewProject(_factory.CompanyA, "ISO-INJECT", "Injected by Bob"));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

        Assert.DoesNotContain(await ListProjectsAsync(alice), x => x.Code == "ISO-INJECT");
        Assert.DoesNotContain(await ListProjectsAsync(bob), x => x.Code == "ISO-INJECT");
    }

    [Fact]
    public async Task A_forged_company_header_does_not_switch_tenant()
    {
        var (bob, _) = await ApiTestClient.LoginAsync(_factory, "bob");

        var forged = new HttpRequestMessage(HttpMethod.Get, "/api/projects");
        forged.Headers.Add("X-PCS-CompanyId", _factory.CompanyA.ToString());

        Assert.Equal(HttpStatusCode.Forbidden, (await bob.SendAsync(forged)).StatusCode);

        var honest = new HttpRequestMessage(HttpMethod.Get, "/api/projects");
        honest.Headers.Add("X-PCS-CompanyId", _factory.CompanyB.ToString());

        Assert.Equal(HttpStatusCode.OK, (await bob.SendAsync(honest)).StatusCode);

        var malformed = new HttpRequestMessage(HttpMethod.Get, "/api/projects");
        malformed.Headers.Add("X-PCS-CompanyId", "not-a-guid");

        Assert.Equal(HttpStatusCode.BadRequest, (await bob.SendAsync(malformed)).StatusCode);
    }

    [Fact]
    public async Task A_viewer_can_read_but_not_write()
    {
        var (alice, _) = await ApiTestClient.LoginAsync(_factory, "alice");
        var (carol, _) = await ApiTestClient.LoginAsync(_factory, "carol");

        Guid projectId = await CreateProjectAsync(alice, _factory.CompanyA, "ISO-VIEW");

        Assert.Contains(await ListProjectsAsync(carol), x => x.Id == projectId);

        Assert.Equal(
            HttpStatusCode.Forbidden,
            (await carol.PostAsJsonAsync(
                "/api/projects",
                NewProject(_factory.CompanyA, "ISO-VIEWER-WRITE", "Nope"))).StatusCode);

        Assert.Equal(HttpStatusCode.Forbidden, (await carol.DeleteAsync($"/api/projects/{projectId}")).StatusCode);
    }

    [Fact]
    public async Task Plants_are_isolated_between_companies()
    {
        var (alice, _) = await ApiTestClient.LoginAsync(_factory, "alice");
        var (bob, _) = await ApiTestClient.LoginAsync(_factory, "bob");

        HttpResponseMessage created = await alice.PostAsJsonAsync(
            "/api/plants",
            new CreatePlantDto { Code = "PL-ISO", Name = "Alice plant", CompanyId = _factory.CompanyA });

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid plantId = await created.Content.ReadFromJsonAsync<Guid>();

        Assert.Equal(HttpStatusCode.OK, (await alice.GetAsync($"/api/plants/{plantId}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await bob.GetAsync($"/api/plants/{plantId}")).StatusCode);

        // Whatever Bob's list calls answer, the plant id must not be in them.
        foreach (string url in new[] { "/api/plants", $"/api/plants/company/{_factory.CompanyA}" })
        {
            HttpResponseMessage response = await bob.GetAsync(url);
            string body = await response.Content.ReadAsStringAsync();

            Assert.DoesNotContain(plantId.ToString(), body);
        }

        Assert.Equal(
            HttpStatusCode.Forbidden,
            (await bob.PostAsJsonAsync(
                "/api/plants",
                new CreatePlantDto { Code = "PL-INJECT", Name = "Injected", CompanyId = _factory.CompanyA })).StatusCode);
    }

    [Fact]
    public async Task Invalid_input_is_a_client_error_not_a_server_error()
    {
        var (alice, _) = await ApiTestClient.LoginAsync(_factory, "alice");

        HttpResponseMessage response = await alice.PostAsJsonAsync(
            "/api/projects",
            NewProject(_factory.CompanyA, "", "No code"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static CreateProjectDto NewProject(Guid companyId, string code, string name) =>
        new()
        {
            Code = code,
            Name = name,
            CompanyId = companyId,
            StartDate = new DateOnly(2026, 1, 1),
            Currency = "USD",
            Status = "Active",
            IsActive = true
        };

    private static async Task<Guid> CreateProjectAsync(HttpClient client, Guid companyId, string code)
    {
        HttpResponseMessage response = await client.PostAsJsonAsync(
            "/api/projects",
            NewProject(companyId, code, $"Project {code}"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        return await response.Content.ReadFromJsonAsync<Guid>();
    }

    private static async Task<List<ProjectDto>> ListProjectsAsync(HttpClient client)
    {
        HttpResponseMessage response = await client.GetAsync("/api/projects");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        return (await response.Content.ReadFromJsonAsync<List<ProjectDto>>())!;
    }
}
