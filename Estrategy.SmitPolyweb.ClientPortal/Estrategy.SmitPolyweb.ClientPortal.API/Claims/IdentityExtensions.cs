using System.Security.Claims;
using System.Security.Principal;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Extentions
{
    public static class IdentityExtensions
    {
        public static string GetName(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.GivenName);

            return claim?.Value ?? string.Empty;
        }
        public static string GetCustomerID(this IIdentity identity)
        {
            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            var claimList = claimsIdentity?.FindAll(ClaimTypes.Name);
            Claim claim = claimList.FirstOrDefault();

            return claim?.Value ?? string.Empty;
        }
    }
}
