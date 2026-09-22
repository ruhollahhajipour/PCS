using System.Security.Cryptography;
using System.Text;

using PCS.Application.Identity.Interfaces;

namespace PCS.Infrastructure.Services.Identity;

public sealed class PasswordHasher : IPasswordHasher
{
    private const string Prefix =
        "PCS-PBKDF2-SHA256";

    private const int SaltSize =
        32;

    private const int HashSize =
        32;

    private const int DefaultIterations =
        100_000;


    public string Hash(
        string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException(
                "Password cannot be empty.",
                nameof(password));
        }


        byte[] salt =
            RandomNumberGenerator.GetBytes(
                SaltSize);


        byte[] hash =
            Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                DefaultIterations,
                HashAlgorithmName.SHA256,
                HashSize);


        return string.Join(
            "$",
            Prefix,
            DefaultIterations,
            Convert.ToBase64String(salt),
            Convert.ToBase64String(hash));
    }


    public bool Verify(
        string password,
        string hash)
    {
        if (string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(hash))
        {
            return false;
        }


        string[] parts =
            hash.Split(
                '$',
                StringSplitOptions.None);


        if (parts.Length != 4)
        {
            return false;
        }


        if (!string.Equals(
                parts[0],
                Prefix,
                StringComparison.Ordinal))
        {
            return false;
        }


        if (!int.TryParse(
                parts[1],
                out int iterations))
        {
            return false;
        }


        if (iterations <= 0)
        {
            return false;
        }


        byte[] salt;

        byte[] expectedHash;

        try
        {
            salt =
                Convert.FromBase64String(
                    parts[2]);

            expectedHash =
                Convert.FromBase64String(
                    parts[3]);
        }
        catch (FormatException)
        {
            return false;
        }


        if (salt.Length == 0 ||
            expectedHash.Length == 0)
        {
            return false;
        }


        byte[] actualHash;

        try
        {
            actualHash =
                Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    salt,
                    iterations,
                    HashAlgorithmName.SHA256,
                    expectedHash.Length);
        }
        catch
        {
            return false;
        }


        return CryptographicOperations.FixedTimeEquals(
            actualHash,
            expectedHash);
    }
}