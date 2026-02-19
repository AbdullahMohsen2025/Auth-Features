using UAEPassPOC.API.Models;

namespace UAEPassPOC.API.Services;

/// <summary>
/// Reusable UAE Pass service contract. Implement or inject in any .NET app.
/// </summary>
public interface IUaePassService
{
    /// <summary>Exchange authorization code for access token.</summary>
    Task<UAEPassTokenDetailsDto> GetAccessTokenAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>Get user info using access token.</summary>
    Task<UaePassResponseDto> GetUserInfoAsync(string accessToken, CancellationToken cancellationToken = default);

    /// <summary>Whether UAE Pass is enabled (from config).</summary>
    bool IsEnabled { get; }

    /// <summary>Frontend config (login URL, logout URL) for client apps.</summary>
    UaePassFrontendConfig GetFrontendConfig();
}

/// <summary>
/// DTO for frontend / any client that needs UAE Pass endpoints.
/// </summary>
public class UaePassFrontendConfig
{
    public string ClientId { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string AcrValues { get; set; } = string.Empty;
}
