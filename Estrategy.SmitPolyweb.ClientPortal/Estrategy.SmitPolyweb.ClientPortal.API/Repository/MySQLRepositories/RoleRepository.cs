using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository
{
    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {

        public RoleRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Roles)
        {
        }


    }
}
