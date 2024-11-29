using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class ArticleTypePropertyRepository : BaseRepository<ArticleTypeProperty>, IArticleTypePropertyRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public ArticleTypePropertyRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.ArticleTypeProperties)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByIDs(ArticleTypePropertyFilterDto articleTypePropertyIDs)
        {
            List<ArticleTypeProperty?> articleTypeProperties = await dbContext.ArticleTypeProperties.Where((articleTypeProperty) => articleTypeProperty.ArticletypeID == articleTypePropertyIDs.ArticleTypeID && articleTypeProperty.PropertyID == articleTypePropertyIDs.PropertyID).ToListAsync();
            return articleTypeProperties;
        }
    }
}
