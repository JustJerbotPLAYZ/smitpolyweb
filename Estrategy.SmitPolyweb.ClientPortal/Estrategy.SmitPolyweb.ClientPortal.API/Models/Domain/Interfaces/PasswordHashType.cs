namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces
{
    public enum PasswordHashType
    {
        /// <summary>
        /// Password hasn't been hashed yet
        /// </summary>
        NotSet,
        /// <summary>
        /// Password has been hashed using a salt
        /// </summary>
        Salted
    }
}
