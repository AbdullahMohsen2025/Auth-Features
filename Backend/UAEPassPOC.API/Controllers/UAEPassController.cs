using Microsoft.AspNetCore.Mvc;
using UAEPassPOC.API.Models;
using UAEPassPOC.API.Services;

namespace UAEPassPOC.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UAEPassController : ControllerBase
{
    private readonly ILogger<UAEPassController> _logger;
    private readonly IUaePassService _uaePassService;

    public UAEPassController(
        ILogger<UAEPassController> logger,
        IUaePassService uaePassService)
    {
        _logger = logger;
        _uaePassService = uaePassService;
    }

    /// <summary>
    /// UAE Pass callback endpoint – receives authorization accessCode and returns user info AND attributes.
    /// </summary>
    [HttpGet("callback")]
    [ProducesResponseType(typeof(UaePassAuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UaePassAuthResponseDto>> UAEPassCallback(string accessCode, string? state, CancellationToken cancellationToken)
    {
        _logger.LogInformation("UAE Pass callback received");

        try
        {
            // 1. Get Token
            var tokenResult = await _uaePassService.GetAccessTokenAsync(accessCode, cancellationToken);

            if (!string.IsNullOrEmpty(tokenResult.error))
            {
                _logger.LogWarning("UAE Pass access token request failed: {Error}", tokenResult.error);
                return BadRequest(new { error = tokenResult.error, description = tokenResult.error_description });
            }

            // 2. Get User Info
            var userInfoResult = await _uaePassService.GetUserInfoAsync(tokenResult.access_token!, cancellationToken);

            if (!string.IsNullOrWhiteSpace(userInfoResult.Error))
            {
                _logger.LogWarning("UAE Pass user info request failed: {Error}", userInfoResult.Error);
                return BadRequest(new { error = userInfoResult.Error, description = userInfoResult.Error_description });
            }

            // TODO: In a real application, instead of just retrieving userInfoResult, we should use the user information to:
            // - Create or update the user in our database, then Login.
            // - Generate our own JWT token to retrieve to the frontend, instead of returning the raw user info from UAE Pass.
            // - Set up user session

            _logger.LogInformation("User authenticated successfully via UAE Pass");

            // 3. Construct the Combined Response
            var response = new UaePassAuthResponseDto
            {
                AccessToken = tokenResult.access_token,
                UserInfo = userInfoResult
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing UAE Pass callback");
            return StatusCode(500, "An error occurred processing your request");
        }
    }


    /// <summary>
    /// Check if UAE Pass is enabled (from config).
    /// </summary>
    [HttpGet("is-enabled")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public ActionResult<bool> CheckUAEPassEnabled()
    {
        return Ok(_uaePassService.IsEnabled);
    }

    /// <summary>
    /// Get UAE Pass configuration for frontend / any client.
    /// </summary>
    [HttpGet("config")]
    [ProducesResponseType(typeof(UaePassFrontendConfig), StatusCodes.Status200OK)]
    public ActionResult<UaePassFrontendConfig> GetUAEPassConfig()
    {
        return Ok(_uaePassService.GetFrontendConfig());
    }

    /// <summary>
    /// A test endpoint that requires the Access Token in the Authorization Header
    /// </summary>
    [HttpGet("test-token")]
    public IActionResult TestToken()
    {
        // In a real app with [Authorize], this is done automatically.
        // Here we manually check to prove the token arrived.
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return Unauthorized("No Authorization header found.");
        }

        string authHeader = Request.Headers["Authorization"].ToString();

        // Simple validation logic for POC
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return Unauthorized("Invalid Bearer token.");
        }

        var token = authHeader.Substring("Bearer ".Length);

        return Ok($"Success! Backend received your token. Token starts with: {token.Substring(0, 5)}...");
    }
}
