namespace PCS.Application.Common.Interfaces;

public interface IStorageService
{
    Task<string> SaveAsync(
        Stream stream,
        string fileName);

    Task<Stream> ReadAsync(
        string path);

    Task DeleteAsync(
        string path);
}