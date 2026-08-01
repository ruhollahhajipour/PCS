using PCS.Application.Common.Interfaces;

namespace PCS.Infrastructure.Storage;

public sealed class LocalStorageService
    : IStorageService
{
    private readonly string _root =
        Path.Combine(
            AppContext.BaseDirectory,
            "Storage");

    public async Task<string> SaveAsync(
        Stream stream,
        string fileName)
    {
        Directory.CreateDirectory(_root);

        var file =
            Guid.NewGuid() +
            Path.GetExtension(fileName);

        var path =
            Path.Combine(_root, file);

        using var output =
            File.Create(path);

        await stream.CopyToAsync(output);

        return file;
    }

    public Task DeleteAsync(
        string path)
    {
        var full =
            Path.Combine(_root, path);

        if (File.Exists(full))
            File.Delete(full);

        return Task.CompletedTask;
    }

    public Task<Stream> ReadAsync(
        string path)
    {
        Stream stream =
            File.OpenRead(
                Path.Combine(_root, path));

        return Task.FromResult(stream);
    }
}