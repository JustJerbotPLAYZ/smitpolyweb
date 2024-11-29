using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class CertificatePropertyRepository : BaseRepository<CertificateProperty>, ICertificatePropertyRespository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public CertificatePropertyRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.CertificateProperties)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<CertificateProperty?>> GetCertificatePropertiesByCertificateID(int ID)
        {
            List<CertificateProperty?> certificatePropertList = await dbContext.CertificateProperties.Where((certProp) => certProp.CertificateID == ID).ToListAsync();
            return certificatePropertList;
        }

        public async Task<CertificateProperty> GetCertificatePropertyByIDs(int certificateID, int propertyID)
        {
            List<CertificateProperty>? certificateProperty = await dbContext.CertificateProperties.Where((certProp) => certProp.CertificateID == certificateID && certProp.PropertyID == propertyID).ToListAsync();
            if (certificateProperty.Count() != 0)
            {
                return certificateProperty[0];
            }
            else
            {
                CertificateProperty certProp = new();
                return certProp;
            }
        }
    }
}
