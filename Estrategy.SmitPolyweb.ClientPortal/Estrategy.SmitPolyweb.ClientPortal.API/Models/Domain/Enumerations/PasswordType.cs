namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations
{
    public enum PasswordType
    {
        /// <summary>
        /// The password hashing is either unknown or not hashed
        /// </summary>
        unspecified,
        /// <summary>
        /// The password is hashed with MD5
        /// </summary>
        MD5,
        /// <summary>
        /// The password is hashed using a salt
        /// </summary>
        Salted
    }
}
