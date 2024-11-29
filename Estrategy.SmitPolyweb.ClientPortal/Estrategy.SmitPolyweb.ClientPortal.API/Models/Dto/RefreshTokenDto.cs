namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class RefreshTokenDto
    {
        public int ID { get; set; }
        public int OwnerID { get; set; }
        public string RefreshTokenValue { get; set; }
        public int? TokenID { get; set; }
        public DateTime ValidUntill { get; set; }

        public RefreshTokenDto(int ownerID, string refreshTokenValue, DateTime validUntill)
        {
            OwnerID = ownerID;
            RefreshTokenValue = refreshTokenValue;
            ValidUntill = validUntill;
        }
    }
}
