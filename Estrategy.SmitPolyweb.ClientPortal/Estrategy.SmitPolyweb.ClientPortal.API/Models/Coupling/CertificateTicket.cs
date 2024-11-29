using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling
{
    public class CertificateTicket : IIdEntity
    {

        #region properties

        public int ID { get; set; }
        public int CertificateID { get; set; }
        public int TicketID { get; set; }
        public Certificate Certificate { get; set; }
        public Ticket Ticket { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking
    }
}
