using Microsoft.Extensions.Options;
using UAEPassPOC.API.Configuration;
using UAEPassPOC.API.Models;

namespace UAEPassPOC.API.Services;

/// <summary>
/// Reusable front config service.
/// </summary>
public class FrontendConfigService : IFrontendConfigService
{
    private readonly UaePassClient _client;
    private readonly UaePassSettings _uaeSettings;
    private readonly EntraSettings _entraSettings;

    public FrontendConfigService(
        UaePassClient client,
        IOptions<UaePassSettings> uaeOptions,
        IOptions<EntraSettings> entraOptions)
    {
        _client = client;
        _uaeSettings = uaeOptions.Value;
        _entraSettings = entraOptions.Value;
    }

    public bool IsEnabled => _uaeSettings.IsEnabled;

    public FrontendConfigDto GetFrontendConfig()
    {
        return new FrontendConfigDto
        {
            // Map Entra Settings
            EntraID = new EntraIdConfigDto
            {
                Instance = _entraSettings.Instance,
                TenantId = _entraSettings.TenantId,
                ClientId = _entraSettings.ClientId,
                RedirectUrl = _entraSettings.FrontendRedirectUri,
                Scopes = _entraSettings.Scopes
            },

            // Map UAE Pass Settings
            UaePass = new UaePassFrontendConfig
            {
                ClientId = _uaeSettings.ClientID,
                BaseUrl = _uaeSettings.BaseUrl,
                Scope = _uaeSettings.Scope,
                State = _uaeSettings.State,
                AcrValues = _uaeSettings.AcrValues,
                RedirectUrl = _uaeSettings.RedirectUrl,
            }
        };
    }

    public async Task<UAEPassTokenDetailsDto> GetAccessTokenAsync(string accessCode, CancellationToken cancellationToken = default)
    {
        return await _client.GetAccessToken(accessCode);
    }

    public async Task<UaePassResponseDto> GetUserInfoAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        return await _client.GetUserInfo(accessToken);
    }
}
