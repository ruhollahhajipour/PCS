using Microsoft.AspNetCore.Mvc;
using PCS.Application.Common.Models;

namespace PCS.API.Common;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected IActionResult Success<T>(
        T data,
        string message = "")
    {
        return Ok(
            ApiResponse<T>.Ok(
                data,
                message));
    }

    protected IActionResult Failure(
        string message)
    {
        return BadRequest(
            ApiResponse<object>.Fail(
                message));
    }
}