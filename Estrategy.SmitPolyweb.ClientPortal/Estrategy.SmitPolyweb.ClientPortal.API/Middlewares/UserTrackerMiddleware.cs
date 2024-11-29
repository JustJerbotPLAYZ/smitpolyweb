using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Exceptions;
using Microsoft.EntityFrameworkCore;


namespace Estrategy.SmitPolyweb.ClientPortal.API.Middlewares
{
    public class UserTrackerMiddleware
    {
        private readonly RequestDelegate next;

        public UserTrackerMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext, EstrategyPolywebDbContext dbContext)
        {
            if (!httpContext.Request.Path.ToString().Contains("Auth"))
            {
                //Get the token used for this request
                string authtoken = httpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
                // Looks if there was a token, then searches for that token in the database
                if (!string.IsNullOrEmpty(authtoken))
                {
                    // Attempts to look for the Token in the Database, if it cannot find it it will throw a UserNotLoggedInException
                    Token token = await dbContext.Tokens.Include(nameof(RefreshToken)).FirstOrDefaultAsync(t => t.TokenValue == authtoken) ?? throw new UserNotLoggedInException("Your token wasn't found! Please try logging in again");


                    if (!ValidateToken(token))
                    {
                        dbContext.Tokens.Remove(token);
                        await dbContext.SaveChangesAsync();
                        throw new UserNotLoggedInException("Your token wasn't found! Please try logging in again");
                    }

                    // Finds the Owner of the Token and sets it as the currentUser, if it cannot find it it will throw a UserNotLoggedInException
                    dbContext.CurrentUser = await dbContext.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.RefreshTokenID == token.RefreshTokenID) ?? throw new UserNotLoggedInException("Your token wasn't found! Please try logging in again");
                }
                else throw new UserNotLoggedInException("Your token wasn't found! Please try logging in again");
            }
            // Continue running the program as normal
            await next(httpContext);
        }

        /// <summary>
        /// A method to hide the guard statements for checking if a token is still valid. <br/>
        /// This method checks if:<br/>
        ///  - token isn't null<br/>
        ///  - the refreshtoken bound to token isn't null<br/>
        ///  - if the refreshtoken isn't past it's lifetime<br/>
        ///  - if the token isn't past it's lifetime
        /// </summary>
        /// <param name="token">The token to validate</param>
        /// <returns>True if all checks pass, else it will return false</returns>
        public bool ValidateToken(Token token)
        {
            var now = DateTime.Now;
            // The refreshtoken is null sometimes, in that case we return a false because we couldn't validate the token
            if (token.RefreshToken == null)
                return false;

            return token.RefreshToken.ValidUntill > now && token.ValidUntill > now;
        }
    }
}
