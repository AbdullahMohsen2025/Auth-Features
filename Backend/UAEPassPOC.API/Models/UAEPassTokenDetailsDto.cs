namespace UAEPassPOC.API.Models;

public class UAEPassTokenDetailsDto
{
    public string? access_token { get; set; }
    public string? expires_in { get; set; }
    public string? scope { get; set; }
    public string? id_token { get; set; }
    public string? error_description { get; set; }
    public string? error { get; set; }
}
