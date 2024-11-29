using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    [DebuggerDisplay("ID = {ID}, UserID = {UserID}, Activated = {ActivationDate}, Expires = {ExpirationDate}, Active = {Active}, OldPasswordHash = {OldPasswordHash}")]

    public class PasswordHistory : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string OldPasswordHash { get; set; }
        public DateTime ActivationDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int UserID { get; set; }

        [NotMapped]
        public bool Active
        {
            get
            {
                return ExpirationDate > DateTime.Now;
            }
        }


        // Navigational Properties
        public User User { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public PasswordHistory() { } //NOTE: empty constructor needed for ef database mapping

        public PasswordHistory(string oldPasswordHash, int userId) //NOTE: each entry is created with every password change
        {
            DateTime now = DateTime.Now;

            OldPasswordHash = oldPasswordHash;
            ActivationDate = now;
            CreationDate = now;
            LastModified = now;
            ExpirationDate = now.AddMonths(3);
            CreatedBy = userId;
            ModifiedBy = userId;
        }

        #endregion constructors
    }
}
