namespace UAEPassPOC.API.Configuration;

/// <summary>
/// Configuration for Microsoft Entra ID. Bind from "AzureAd" section in appsettings.
/// </summary>
public class EntraSettings
{
    public string Instance { get; set; } = "https://login.microsoftonline.com/";
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string Scopes { get; set; } = string.Empty;
    public string FrontendRedirectUri { get; set; } = string.Empty;
}