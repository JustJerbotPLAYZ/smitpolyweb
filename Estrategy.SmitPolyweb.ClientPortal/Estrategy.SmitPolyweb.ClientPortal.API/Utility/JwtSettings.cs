namespace Estrategy.SmitPolyweb.ClientPortal.API.Utility
{
    public class JwtSettings
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int AccessTokenExpirationMinutes { get; set; }
        public int RefreshTokenExpirationDays { get; set; }

        public JwtSettings(string key, string issuer, string audience, int accessTokenExpirationMinutes, int refreshTokenExpirationDays)
        {
            Key = key;
            Issuer = issuer;
            Audience = audience;
            AccessTokenExpirationMinutes = accessTokenExpirationMinutes;
            RefreshTokenExpirationDays = refreshTokenExpirationDays;
        }
    }
}
