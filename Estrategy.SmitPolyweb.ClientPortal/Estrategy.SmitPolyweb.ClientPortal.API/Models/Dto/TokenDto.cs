namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class TokenDto
    {
        public int ID { get; set; }
        public string? TokenValue { get; set; }
        public int? RefreshTokenID { get; set; }
        public DateTime? ValidUntill { get; set; }
    }
}
