using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class RefreshToken
    {
        #region properties

        [Key]
        public int ID { get; set; }
        public int OwnerID { get; set; }
        public string RefreshTokenValue { get; set; }
        public int? TokenID { get; set; }
        public DateTime ValidUntill { get; set; }

        // Navigational Properties
        public Token? Token { get; set; }
        public User Owner { get; set; }

        #endregion properties

        #region constructors

        public RefreshToken(int ownerID, string refreshTokenValue, DateTime validUntill)
        {
            OwnerID = ownerID;
            RefreshTokenValue = refreshTokenValue;
            ValidUntill = validUntill;
        }

        #endregion constructors
    }
}
