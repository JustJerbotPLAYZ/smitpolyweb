using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByIDAsync(int? ID);

        Task<RefreshToken?> GetByTokenValueAsync(string TokenValue);

        Task<RefreshToken> CreateRefreshTokenAsync(User owner);

        Task DeleteRefreshToken(RefreshToken refreshToken);
    }
}
