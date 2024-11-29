using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using System.Security.Principal;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class CertificateType : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructor

        public CertificateType(string name, string description)
        {
            this.Name = name;
            this.Description = description;
        }

        #endregion constructor

    }
}
