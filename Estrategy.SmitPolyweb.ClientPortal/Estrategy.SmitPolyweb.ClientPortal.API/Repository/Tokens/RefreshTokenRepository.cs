using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Tokens
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {

        private readonly EstrategyPolywebDbContext _dbContext;
        private readonly JwtSettings _jwtSettings;

        public RefreshTokenRepository(EstrategyPolywebDbContext dbContext, JwtSettings jwtSettings)
        {
            _dbContext = dbContext;
            _jwtSettings = jwtSettings;
        }

        public async Task<RefreshToken?> GetByIDAsync(int? ID)
        {
            return await _dbContext.RefreshTokens.Include(nameof(Token)).FirstOrDefaultAsync(token => token.ID == ID);
        }

        public async Task<RefreshToken?> GetByTokenValueAsync(string TokenValue)
        {
            return await _dbContext.RefreshTokens.Include(nameof(Token)).Include("Owner").FirstOrDefaultAsync(token => token.RefreshTokenValue == TokenValue);
        }

        public async Task<RefreshToken> CreateRefreshTokenAsync(User owner)
        {
            string refreshTokenValue;
            using (var rng = RandomNumberGenerator.Create())
            {
                var randomNumber = new byte[32];
                rng.GetBytes(randomNumber);
                refreshTokenValue = Convert.ToBase64String(randomNumber);
            }
            RefreshToken refreshToken = new RefreshToken(
                ownerID: owner.ID,
                refreshTokenValue: refreshTokenValue,
                validUntill: DateTime.Now.AddDays(_jwtSettings.RefreshTokenExpirationDays));

            owner.RefreshToken = refreshToken;

            _dbContext.RefreshTokens.Add(refreshToken);

            await _dbContext.SaveChangesAsync();

            return refreshToken;
        }

        public async Task DeleteRefreshToken(RefreshToken refreshToken)
        {
            if (refreshToken.Token != null)
                _dbContext.Remove(refreshToken.Token);

            _dbContext.Remove(refreshToken);
            await _dbContext.SaveChangesAsync();
        }
    }
}
