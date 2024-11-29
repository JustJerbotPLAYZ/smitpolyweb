using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{

    public class PropertyRepository : BaseRepository<Property>, IPropertyRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public PropertyRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Properties)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Property?>> GetPropertiesByIDAsync(List<int> Properties)
        {
            List<Property?> propertiesList = [];
            for (int i = Properties.Count - 1; i >= 0; i--)
            {
                Property? property = await GetByIDAsync(Properties[i]);
                propertiesList.Add(property);
            }
            return propertiesList;
        }
    }
}


