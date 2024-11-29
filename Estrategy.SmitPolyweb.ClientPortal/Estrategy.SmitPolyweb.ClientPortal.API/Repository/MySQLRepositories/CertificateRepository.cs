using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class CertificateRepository : BaseRepository<Certificate>, ICertificateRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public CertificateRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Certificates)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Certificate>> GetRemindersAsync(ReminderDto reminderDto)
        {
            // Start with a queryable object from the DbSet
            var query = dbContext.Certificates.AsQueryable();

            var now = DateTime.Now;

            if (!string.IsNullOrWhiteSpace(reminderDto.DebtorNumber))
            {
                query = query.Where(cert => cert.DebtorNumber.Contains(reminderDto.DebtorNumber));
            }

            if (!(reminderDto.ThisMonth || reminderDto.NextMonth || reminderDto.LastMonth))
            {
                if (reminderDto.StartSearchDate != null && reminderDto.EndSearchDate != null)
                {
                    query = query.Where(cert => cert.ExpirationDate >= reminderDto.StartSearchDate
                                             && cert.ExpirationDate <= reminderDto.EndSearchDate);
                }
                else if (reminderDto.StartSearchDate != null)
                {
                    query = query.Where(cert => cert.ExpirationDate >= reminderDto.StartSearchDate);
                }
                else if (reminderDto.EndSearchDate != null)
                {
                    query = query.Where(cert => cert.ExpirationDate <= reminderDto.EndSearchDate);
                }
            }

            if (reminderDto.ThisMonth)
            {
                query = query.Where(cert => now >= cert.ExpirationDate && cert.ExpirationDate <= now.AddMonths(1));
            }

            if (reminderDto.NextMonth)
            {
                query = query.Where(cert => now.AddMonths(1) >= cert.ExpirationDate && cert.ExpirationDate <= now.AddMonths(2));
            }

            if (reminderDto.LastMonth)
            {
                query = query.Where(cert => now.AddMonths(-1) >= cert.ExpirationDate && cert.ExpirationDate <= now);
            }

            return await query.ToListAsync();
        }
    }
}
