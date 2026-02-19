namespace UAEPassPOC.API.Configuration;

/// <summary>
/// Configuration for UAE Pass. Bind from "UaePass" section in appsettings.
/// </summary>
public class UaePassSettings
{
    public bool IsEnabled { get; set; }
    public string ClientID { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string AcrValues { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public string TokenMethod { get; set; } = string.Empty;
    public string UserInfoMethod { get; set; } = string.Empty;
}
