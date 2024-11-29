using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{

    public class ChecklistFieldRepository : BaseRepository<ChecklistField>, IChecklistFieldRepository
    {
        public ChecklistFieldRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.ChecklistFields)
        {

        }

    }
}

