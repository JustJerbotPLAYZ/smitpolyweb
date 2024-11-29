using System.Diagnostics;
using System.Text.Json.Serialization;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    [DebuggerDisplay("ID = {ID}, Email = {Email}, Name = {FirstName} {Infix} {LastName}, Role = {RoleID}, Active = {AccountActive}, Blocked = {AccountBlocked}")]
    public class User : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public PasswordHashType PasswordHashType { get; set; }
        public string FirstName { get; set; }
        public string? Infix { get; set; }
        public string LastName { get; set; }
        public int RoleID { get; set; }
        public int? RefreshTokenID { get; set; }

        public bool AccountActive { get; set; }
        public bool AccountBlocked { get; set; }

        public int? CustomerID { get; set; }
        //Navigational Properties
        [JsonIgnore]
        public Customer Customer { get; set; }
        public RefreshToken? RefreshToken { get; set; }
        public Role Role { get; set; }

        public List<PasswordHistory> previouslyUsedPasswords { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public User(string email, string password, string firstName, string? infix, string lastName, int roleID, bool accountActive, bool accountBlocked, int? customerID,
            PasswordHashType passwordHashType = PasswordHashType.NotSet, int? refreshTokenID = null)
        {
            Email = email.ToLower();
            Password = password;
            PasswordHashType = passwordHashType;
            FirstName = firstName;
            Infix = infix;
            LastName = lastName;
            RoleID = roleID;
            RefreshTokenID = refreshTokenID;
            CustomerID = customerID;
            AccountActive = accountActive;
            AccountBlocked = accountBlocked;
            previouslyUsedPasswords = [];
        }

        #endregion constructors
    }
}
