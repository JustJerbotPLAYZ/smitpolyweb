using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public CertificateService(EstrategyPolywebDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<PaginationRequest<Certificate>> GetAllFilteredAsync(CertificateFilterDto certificateDto)
        {
            // NOTE: This should never get triggered but it will give annoying errors anyways if I don't put this here -J
            if (certificateDto.Amount == null || certificateDto.ToSkip == null)
                return new PaginationRequest<Certificate>([], 0);

            int amount = (int)certificateDto.Amount;
            int toSkip = (int)certificateDto.ToSkip;

            // Start the query as IQueryable to build the filters dynamically
            // This is to reduce the load on the database by filtering imidiately instead of getting all Certificate and filtering after that
            var query = dbContext.Certificates.AsQueryable();
            var now = DateTime.Now;

            if (dbContext.CurrentUser != null)
                //NOTE: If the role is not inside a case, it will grab the default of all certificates
                switch (dbContext.CurrentUser.Role.Name.ToLower())
                {
                    case "mechanic":
                        query = GetQueryForMechanic(dbContext.CurrentUser.ID);
                        break;
                    case "customer":
                        if (dbContext.CurrentUser.CustomerID.HasValue)
                            query = GetCertificatesForCustomer((int)dbContext.CurrentUser.CustomerID);
                        break;
                }

            var test = await query.ToListAsync();

            #region filter

            // Only apply filters and/or search requests if AllCertificates is not selected
            if (!certificateDto.AllCertificates)
            {
                query = query.Where(cert =>
                    (certificateDto.OutofOrder && cert.Status == CertificateStatus.OutofOrder) ||
                    (certificateDto.Disapproved && cert.Status == CertificateStatus.Disapproved) ||
                    (certificateDto.Expired && cert.Status == CertificateStatus.Expired) ||
                    (certificateDto.AfterMonth && cert.ExpirationDate >= now.AddMonths(2) && cert.Status == CertificateStatus.Valid) ||
                    (certificateDto.DuringMonth && cert.ExpirationDate <= now.AddMonths(2) && cert.Status == CertificateStatus.Valid));
            }

            #endregion filter

            #region search

            if (certificateDto.RegistrationNumber.HasValue && certificateDto.RegistrationNumber > 0)
            {
                query = query.Where(cert => cert.RegistrationNumber.ToString().Contains(certificateDto.RegistrationNumber.Value.ToString()));
            }

            if (!string.IsNullOrEmpty(certificateDto.DebtorNumber))
            {
                query = query.Where(cert => cert.DebtorNumber.Contains(certificateDto.DebtorNumber));
            }

            if (!string.IsNullOrEmpty(certificateDto.CustomerSearchName))
            {
                query = query.Where(cert => cert.CustomerSearchName != null && cert.CustomerSearchName.Contains(certificateDto.CustomerSearchName));
            }

            if (!string.IsNullOrEmpty(certificateDto.CustomerReferenceNumber))
            {
                query = query.Where(cert => cert.CustomerReferenceNumber.Contains(certificateDto.CustomerReferenceNumber));
            }

            if (!string.IsNullOrEmpty(certificateDto.Description))
            {
                query = query.Where(cert => cert.Description != null && cert.Description.Contains(certificateDto.Description));
            }

            if (!string.IsNullOrEmpty(certificateDto.ExtraInfo))
            {
                query = query.Where(cert => cert.ExtraInfo != null && cert.ExtraInfo.Contains(certificateDto.ExtraInfo));
            }

            if (certificateDto.SearchDate.HasValue)
            {
                query = query.Where(cert => cert.ExpirationDate > certificateDto.SearchDate);
            }

            #endregion search

            #region pagination

            // Calculate the total records;
            var totalRecords = await query.CountAsync();

            // Retrieve the certificates for the requested page
            var certificates = await query
                .OrderBy(cert => cert.ID)
                .Skip(toSkip)
                .Take(amount)
                .ToListAsync();

            #endregion pagination

            // Return the information gathered above
            return new PaginationRequest<Certificate>(certificates, totalRecords);
        }

        private IQueryable<Certificate> GetCertificatesForCustomer(int customerID)
        {
            return dbContext.Certificates.Where(cert => cert.CustomerID == customerID).AsQueryable();
        }

        private IQueryable<Certificate> GetQueryForMechanic(int userID)
        {
            return dbContext.Tickets
                .Where(ticket => ticket.UserID == userID)
                .Join(
                    dbContext.CertificateTickets,
                    ticket => ticket.ID,
                    certTicket => certTicket.TicketID,
                    (ticket, certTicket) => certTicket.CertificateID
                )
                .Distinct()
                .Join(
                    dbContext.Certificates,
                    certTicketId => certTicketId,
                    certificate => certificate.ID,
                    (certTicketId, certificate) => certificate
                )
                .AsQueryable();
        }

        public async Task<Certificate?> GetCertificateByIDAsync(int ID)
        {
            Certificate? certificate = await dbContext.Certificates
                .Include(c => c.CertificateType)
                .Include(c => c.Article)
                    .ThenInclude(a => a.ArticleType)
                    .ThenInclude(at => at.Properties)
                .Include(c => c.Customer)
                    .ThenInclude(c => c.Address)
                .Include(c => c.Properties)
                    .ThenInclude(p => p.Property)
                    .ThenInclude(p => p.PropertyChoises)
                .Include(c => c.Supplier)
                    .ThenInclude(s => s.Address)
                .Include(c => c.SupplierAddress)
                .Include(c => c.CustomerAddress)
                .FirstOrDefaultAsync(cert => cert.ID == ID);
            return certificate;
        }
    }
}
