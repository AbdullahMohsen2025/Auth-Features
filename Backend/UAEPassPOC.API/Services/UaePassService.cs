using Microsoft.Extensions.Options;
using UAEPassPOC.API.Configuration;
using UAEPassPOC.API.Models;

namespace UAEPassPOC.API.Services;

/// <summary>
/// Reusable UAE Pass service. Inject IUaePassService in any app.
/// </summary>
public class UaePassService : IUaePassService
{
    private readonly UaePassClient _client;
    private readonly UaePassSettings _settings;

    public UaePassService(UaePassClient client, IOptions<UaePassSettings> options)
    {
        _client = client;
        _settings = options.Value;
    }

    public bool IsEnabled => _settings.IsEnabled;

    public UaePassFrontendConfig GetFrontendConfig()
    {
        return new UaePassFrontendConfig
        {
            ClientId = _settings.ClientID,
            BaseUrl = _settings.BaseUrl,
            Scope = _settings.Scope,
            State = _settings.State,
            AcrValues = _settings.AcrValues,
            RedirectUrl = _settings.RedirectUrl,
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
