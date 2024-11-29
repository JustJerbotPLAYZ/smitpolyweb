using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Role : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string Name { get; set; }
        public List<Permission> Permissions { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors
        public Role(string name, List<Permission> permissions)
        {
            Name = name;
            Permissions = permissions;
        }

        #endregion constructors
    }
}
