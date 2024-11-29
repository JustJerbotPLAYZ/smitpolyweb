using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class TokensDto
    {
        [Required]
        public string RefreshTokenValue { get; set; }
        public string? AccessTokenValue { get; set; }

        public TokensDto(string refreshTokenValue, string accessTokenValue)
        {
            RefreshTokenValue = refreshTokenValue;
            AccessTokenValue = accessTokenValue;
        }
    }
}
