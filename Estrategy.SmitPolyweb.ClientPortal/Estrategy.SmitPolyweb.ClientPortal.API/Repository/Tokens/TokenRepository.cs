using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Tokens
{
    public class TokenRepository : ITokenRepository
    {
        private readonly EstrategyPolywebDbContext _dbContext;
        private readonly JwtSettings _jwtSettings;

        public TokenRepository(EstrategyPolywebDbContext dbContext, JwtSettings jwtSettings)
        {
            _dbContext = dbContext;
            _jwtSettings = jwtSettings;
        }

        public async Task<Token> CreateJWTTokenAsync(User user)
        {
            Role? userRole = await _dbContext.Roles.FirstOrDefaultAsync(r => r.ID == user.RoleID) ?? throw new ArgumentNullException(nameof(user.Role), "An attempt to make a token was made but the user doesn't have a Role!");
            if (user.RefreshToken == null)
                throw new ArgumentNullException(nameof(user.RefreshToken), "An attempt to make a token was made but the user doesn't have a refresh token!");
            RefreshToken refreshToken = user.RefreshToken;

            List<Permission> permissions = userRole.Permissions;

            // Create claims
            List<Claim> claims = [new(ClaimTypes.Email, user.Email)];

            foreach (Permission perm in permissions)
            {
                claims.Add(new(ClaimTypes.Role, perm.ToString()));
            }

            claims.Add(new Claim(ClaimTypes.Name, user.CustomerID.ToString(), ClaimValueTypes.String));
            claims.Add(new Claim(ClaimTypes.GivenName, user.Role.Name, ClaimValueTypes.String));
            for (int i = claims.Count() - 1; i >= 0; i--)
            {
                Console.WriteLine(claims[i]);
            }

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


            DateTime expirationDate = DateTime.Now.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes);

            JwtSecurityToken securityToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expirationDate,
                signingCredentials: credentials);

            Token token = new Token(
                tokenValue: new JwtSecurityTokenHandler().WriteToken(securityToken),
                refreshTokenID: refreshToken.ID,
                validUntill: expirationDate);

            token.RefreshToken = refreshToken;

            _dbContext.Tokens.Add(token);

            await _dbContext.SaveChangesAsync();

            return token;
        }

        public async Task<Token?> GetByAccessTokenAsync(string AccessToken)
        {
            return await _dbContext.Tokens.Include("Owner").FirstOrDefaultAsync(t => t.TokenValue.Equals(AccessToken));
        }

        public async Task RemoveTokenAsync(Token token)
        {
            token.RefreshToken.TokenID = null;
            token.RefreshToken.Token = null;
            _dbContext.Tokens.Remove(token);
            await _dbContext.SaveChangesAsync();
        }
    }
}