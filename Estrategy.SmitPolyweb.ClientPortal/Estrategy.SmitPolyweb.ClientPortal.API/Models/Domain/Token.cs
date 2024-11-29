using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Token
    {
        #region properties

        [Key]
        public int ID { get; set; }
        public string TokenValue { get; set; }
        public int RefreshTokenID { get; set; }
        public DateTime ValidUntill { get; set; }


        // Navigational Properties
        public RefreshToken RefreshToken { get; set; }

        #endregion properties

        #region constructors

        public Token(string tokenValue, int refreshTokenID, DateTime validUntill)
        {
            TokenValue = tokenValue;
            RefreshTokenID = refreshTokenID;
            ValidUntill = validUntill;
        }

        #endregion constructors
    }
}
