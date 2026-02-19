namespace UAEPassPOC.API.Models
{
    public class UaePassAuthResponseDto
    {
        public string? AccessToken { get; set; }
        public UaePassResponseDto? UserInfo { get; set; }
    }
}
