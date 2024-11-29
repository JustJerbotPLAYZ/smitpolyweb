using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class SupplierRepository : BaseRepository<Supplier>, ISupplierRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public SupplierRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Suppliers)
        {
            this.dbContext = dbContext;
        }
    }
}
