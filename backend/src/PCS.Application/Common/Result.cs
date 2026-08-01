namespace PCS.Application.Common.Results;

public class Result
{
    public bool Success { get; init; }

    public string? Error { get; init; }

    public static Result Ok()
        => new()
        {
            Success = true
        };

    public static Result Failure(
        string error)
        => new()
        {
            Success = false,
            Error = error
        };
}