using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class CertificateTypeRepository : BaseRepository<CertificateType>, ICertificateTypeRepository
    {
        public CertificateTypeRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.CertificateTypes)
        {
        }
    }
}
