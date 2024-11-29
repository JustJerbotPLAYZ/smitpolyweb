namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class LoginRequestTokenDto
    {
        public string Token { get; set; }

        public LoginRequestTokenDto(string Token)
        {
            this.Token = Token;
        }
    }
}
