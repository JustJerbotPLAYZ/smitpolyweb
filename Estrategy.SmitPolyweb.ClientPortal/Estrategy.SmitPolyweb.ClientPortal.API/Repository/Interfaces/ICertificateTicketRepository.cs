using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ICertificateTicketRepository : IBaseRepostory<CertificateTicket>
    {
        Task<List<CertificateTicket>> GetCertificatesByTicketID(int ticketID);
        Task<CertificateTicket> GetCertificateTicketByIDs(int ticketID, int certificateID);
    }
}
