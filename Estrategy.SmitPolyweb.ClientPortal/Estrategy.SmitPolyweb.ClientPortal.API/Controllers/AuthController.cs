using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.AspNetCore.Mvc;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly ITokenRepository tokenRepository;
        private readonly IRefreshTokenRepository refreshTokenRepository;
        private readonly IMapper mapper;

        public AuthController(IUserRepository userRepository, ITokenRepository tokenRepository, IRefreshTokenRepository refreshTokenRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.tokenRepository = tokenRepository;
            this.refreshTokenRepository = refreshTokenRepository;
            this.mapper = mapper;
        }


        /// <summary>
        /// Log the user in using their Email and Password, this endpoint is accesible through<br/>
        /// POST: /api/Auth/Login<br/>
        /// </summary>
        /// <param name="loginRequest">The information given from the user to attempt a login</param>
        /// <remarks>The returned JWT token has a lifespan of an hour</remarks>
        /// <returns>Returns a http status code, OK 200 on success, Bad Request 400 on failure</returns>
        [HttpPost]
        [Route("Login")]
        [ValidateModel]
        public async Task<IActionResult> LoginAsync([FromBody] LogInRequestDto loginRequest)
        {
            User? user = await userRepository.GetByEmailAsync(loginRequest.Email.ToLower());

            #region Guard Clauses
            // Checks if the user was found in the database and if their password matches
            if (user == null || !PasswordHelper.GenerateSaltedPassword(loginRequest.Password, user.CreationDate.ToString()).Equals(user.Password))
                return BadRequest("Username or password incorrect"); // Returns bad request if either the username or password is incorrect

            if (user.AccountBlocked)
            {
                return Forbid();
            }

            // Checks if the user doesn't have a role or if that role doesn't have permissions
            if (user.Role == null || user.Role.Permissions == null)
                return Unauthorized(); // Returns a 401 when you have no Role or Permissions, this should NEVER happend 
            #endregion Guard Clauses

            #region Token Retrieval

            //if (user.RefreshToken != null && user.RefreshToken.ValidUntill > DateTime.Now.AddDays(1))
            //    refreshToken = await refreshTokenRepository.GetByIDAsync(user.RefreshTokenID);
            RefreshToken? refreshToken = await refreshTokenRepository.CreateRefreshTokenAsync(user);

            if (refreshToken.Token != null)
                await tokenRepository.RemoveTokenAsync(refreshToken.Token);
            Token token = await tokenRepository.CreateJWTTokenAsync(user);

            #endregion Token Retrieval

            if (user.previouslyUsedPasswords.Any())
            {
                if (!user.previouslyUsedPasswords.Last().Active)
                {
                    var expiredPasswordResponse = new
                    {
                        Error = "Password expired",
                        Message = "Update password to continue",
                        user = user,
                        refreshTokenValue = refreshToken.RefreshTokenValue,
                        accessTokenValue = token.TokenValue,
                    };

                    return StatusCode(StatusCodes.Status200OK, expiredPasswordResponse);
                }
            }
            else // NOTE: it should only execute during data import
            {
                var expiredPasswordResponse = new
                {
                    Error = "Password expired",
                    Message = "Update password to continue",
                    user = user,
                    refreshTokenValue = refreshToken.RefreshTokenValue,
                    accessTokenValue = token.TokenValue,
                };

                return StatusCode(StatusCodes.Status200OK, expiredPasswordResponse);
            }

            // Return OK 200 and the users token
            return Ok(new TokensDto(
                    refreshTokenValue: refreshToken.RefreshTokenValue,
                    accessTokenValue: token.TokenValue
                ));

        }

        [HttpPost]
        [Route("GetByMail")]
        [ValidateModel]
        public async Task<IActionResult> GetEmailByID([FromBody] UserEmailDto user)
        {
            if (user.Email == null)
                return BadRequest();

            User? userDomain = await userRepository.GetByEmailAsync(user.Email.ToLower());

            if (userDomain == null)
                return NotFound();

            UserDto newUser = mapper.Map<UserDto>(userDomain);
            Role userRole = userDomain.Role;

            return Ok(new { newUser, userRole });

        }

        [HttpPost]
        [Route("Refresh")]
        [ValidateModel]
        public async Task<IActionResult> RefreshAccessTokenAsync([FromBody] TokensDto refreshRequest)
        {
            if (refreshRequest.RefreshTokenValue == null)
                return BadRequest();
            RefreshToken? refreshToken = await refreshTokenRepository.GetByTokenValueAsync(refreshRequest.RefreshTokenValue);

            #region Guard Clauses

            if (refreshToken == null)
                return NotFound("The token you provided was not found on the server");

            if (refreshToken.ValidUntill < DateTime.Now)
                return BadRequest("This refresh token has expired, please log in again");

            #endregion Guard Clauses

            if (refreshToken.Token != null)
                await tokenRepository.RemoveTokenAsync(refreshToken.Token);
            Token token = await tokenRepository.CreateJWTTokenAsync(refreshToken.Owner);

            return Ok(new TokensDto(
                refreshTokenValue: refreshToken.RefreshTokenValue,
                accessTokenValue: token.TokenValue
            ));
        }
    }
}
