using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class PropertyChoiseRepository : BaseRepository<PropertyChoise>, IPropertyChoiseRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public PropertyChoiseRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.PropertyChoises)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<PropertyChoise>?> GetPropertyChoisesByPropertyID(Property property)
        {
            List<PropertyChoise>? propertychoises = await dbContext.PropertyChoises.Where((propertyChoise) => propertyChoise.PropertyID == property.ID).ToListAsync();
            return propertychoises;
        }
    }
}
