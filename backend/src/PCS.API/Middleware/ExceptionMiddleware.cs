using System.Net;
using PCS.Application.Common.Models;

namespace PCS.API.Middleware;

public sealed class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;


    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }



    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled exception occurred");


            context.Response.ContentType =
                "application/json";


            context.Response.StatusCode =
                (int)HttpStatusCode.InternalServerError;



            var errors = new List<string>();


            var current = ex;


            while (current != null)
            {
                if (!string.IsNullOrWhiteSpace(
                    current.Message))
                {
                    errors.Add(
                        current.Message);
                }


                current = current.InnerException;
            }



            var response =
                ApiResponse<object>.Fail(
                    "An unexpected error occurred.",
                    errors.ToArray());



            await context.Response.WriteAsJsonAsync(
                response);
        }
    }
}