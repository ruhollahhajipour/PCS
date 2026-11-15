using System.Security.Cryptography;
using PCS.Infrastructure.Services.Identity;

namespace PCS.Application.Tests.Security;

public sealed class PasswordHasherTests
{
    private readonly PasswordHasher _hasher = new();

    [Fact]
    public void Hash_uses_current_pbkdf2_work_factor_and_verifies_password()
    {
        const string password = "Strong-PCS-Test-Password!";

        string encodedHash = _hasher.Hash(password);
        string[] parts = encodedHash.Split('$');

        Assert.Equal("PCS-PBKDF2-SHA256", parts[0]);
        Assert.Equal("600000", parts[1]);
        Assert.False(_hasher.NeedsRehash(encodedHash));
        Assert.True(_hasher.Verify(password, encodedHash));
        Assert.False(_hasher.Verify("wrong-password", encodedHash));
    }

    [Fact]
    public void Verify_remains_compatible_with_existing_100k_hashes()
    {
        const string password = "Legacy-PCS-Password!";
        const int legacyIterations = 100_000;
        byte[] salt = RandomNumberGenerator.GetBytes(32);
        byte[] derivedKey = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            legacyIterations,
            HashAlgorithmName.SHA256,
            32);

        string legacyHash = string.Join(
            "$",
            "PCS-PBKDF2-SHA256",
            legacyIterations,
            Convert.ToBase64String(salt),
            Convert.ToBase64String(derivedKey));

        Assert.True(_hasher.NeedsRehash(legacyHash));
        Assert.True(_hasher.Verify(password, legacyHash));
    }

    [Fact]
    public void Verify_rejects_hashes_with_excessive_iteration_counts()
    {
        var salt = Convert.ToBase64String(new byte[32]);
        var hash = Convert.ToBase64String(new byte[32]);
        string encodedHash = $"PCS-PBKDF2-SHA256$1000001${salt}${hash}";

        Assert.False(_hasher.Verify("password", encodedHash));
    }

    [Fact]
    public void Verify_rejects_unexpected_salt_or_hash_lengths()
    {
        string encodedHash = string.Join(
            "$",
            "PCS-PBKDF2-SHA256",
            "100000",
            Convert.ToBase64String(new byte[16]),
            Convert.ToBase64String(new byte[32]));

        Assert.False(_hasher.Verify("password", encodedHash));
    }
}
