using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using UAEPassPOC.API.Configuration;
using UAEPassPOC.API.Models;

namespace UAEPassPOC.API.Services;

public class UaePassClient
{
    private readonly ILogger<UaePassClient> _logger;
    private readonly UaePassSettings _settings;
    private const string DefaultGrantType = "authorization_code";

    public UaePassClient(ILogger<UaePassClient> logger, IOptions<UaePassSettings> options)
    {
        _logger = logger;
        _settings = options.Value;
    }

    public async Task<UAEPassTokenDetailsDto> GetAccessToken(string accessCode)
    {
        _logger.LogInformation("GetAccessToken started");

        var httpClientHandler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
        };

        try
        {
            var client = new HttpClient(httpClientHandler)
            {
                BaseAddress = new Uri(_settings.TokenMethod),
            };
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            _logger.LogInformation("Sending request to get access token");
            var request = GetRequestMessage(accessCode);
            var resp = await client.SendAsync(request, HttpCompletionOption.ResponseContentRead);

            string responseBody = await resp.Content.ReadAsStringAsync();
            if (resp != null && resp.IsSuccessStatusCode)
            {
                _logger.LogInformation("Access token retrieved successfully.");
                return JsonConvert.DeserializeObject<UAEPassTokenDetailsDto>(responseBody) ?? new UAEPassTokenDetailsDto();
            }
            else
            {
                var error = !string.IsNullOrWhiteSpace(responseBody)
                    ? JsonConvert.DeserializeObject<UAEPassTokenDetailsDto>(responseBody)
                    : new UAEPassTokenDetailsDto();
                _logger.LogWarning("Failed to retrieve access token. StatusCode: {StatusCode}", resp.StatusCode);
                return error ?? new UAEPassTokenDetailsDto();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving the access token.");
            throw;
        }
    }

    public async Task<UaePassResponseDto> GetUserInfo(string accessToken)
    {
        _logger.LogInformation("GetUserInfo started");

        var httpClientHandler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
        };

        try
        {
            HttpClient client = new HttpClient(httpClientHandler);
            var requestUri = _settings.UserInfoMethod;
            client.BaseAddress = new Uri(requestUri);
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            _logger.LogInformation("Sending request to UserInfoMethod: {BaseAddress}", client.BaseAddress);

            HttpResponseMessage resp = await client.GetAsync("");

            string responseBody = await resp.Content.ReadAsStringAsync();

            if (resp != null && resp.IsSuccessStatusCode)
            {
                _logger.LogInformation("User information retrieved successfully.");
                return JsonConvert.DeserializeObject<UaePassResponseDto>(responseBody) ?? new UaePassResponseDto();
            }
            else
            {
                _logger.LogWarning("Failed to retrieve user information. StatusCode: {StatusCode}", resp.StatusCode);
                var error = !string.IsNullOrWhiteSpace(responseBody)
                    ? JsonConvert.DeserializeObject<UaePassResponseDto>(responseBody)
                    : new UaePassResponseDto();
                return error ?? new UaePassResponseDto();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving user information.");
            throw;
        }
    }

    private HttpRequestMessage GetRequestMessage(string code)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, _settings.TokenMethod);
        request.Content = new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                { "grant_type", DefaultGrantType },
                { "code", code },
                { "redirect_uri", _settings.RedirectUrl },
                { "client_id", _settings.ClientID },
                { "client_secret", _settings.SecretKey }
            }
        );

        return request;
    }
}
