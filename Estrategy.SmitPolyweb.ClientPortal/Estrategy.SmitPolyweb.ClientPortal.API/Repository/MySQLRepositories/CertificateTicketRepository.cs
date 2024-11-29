using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class CertificateTicketRepository : BaseRepository<CertificateTicket>, ICertificateTicketRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public CertificateTicketRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.CertificateTickets)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<CertificateTicket>> GetCertificatesByTicketID(int ticketID)
        {
            List<CertificateTicket> certificateTickets = await dbContext.CertificateTickets.Where((x) => x.TicketID == ticketID).ToListAsync();
            return certificateTickets;
        }

        public async Task<CertificateTicket> GetCertificateTicketByIDs(int ticketID, int certificateID)
        {
            List<CertificateTicket> certificateTicket = await dbContext.CertificateTickets.Where((c => c.TicketID == ticketID && c.CertificateID == certificateID)).ToListAsync();
            return certificateTicket[0];
        }
    }
}
