using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ITokenRepository
    {
        Task<Token> CreateJWTTokenAsync(User user);
        Task<Token?> GetByAccessTokenAsync(string AccessToken);
        Task RemoveTokenAsync(Token token);
    }
}
