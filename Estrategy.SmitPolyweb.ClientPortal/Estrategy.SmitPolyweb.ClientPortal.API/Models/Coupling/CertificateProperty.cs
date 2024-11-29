using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling
{
    public class CertificateProperty : IIdEntity
    {
        public int ID { get; set; }
        public string? Value { get; set; }
        public int CertificateID { get; set; }
        public Certificate Certificate { get; set; }
        public int PropertyID { get; set; }
        public Property Property { get; set; }

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking
    }
}
