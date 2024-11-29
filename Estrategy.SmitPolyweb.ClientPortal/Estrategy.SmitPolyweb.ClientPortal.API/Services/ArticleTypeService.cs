using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services
{
    public class ArticleTypeService : IArticleTypeService
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public ArticleTypeService(EstrategyPolywebDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByArticleTypeID(ArticleType articleType)
        {
            List<ArticleTypeProperty>? articleTypeProperty = dbContext.ArticleTypeProperties.Where((articleTypeProp) => articleTypeProp.ArticletypeID == articleType.ID).ToList();
            return articleTypeProperty;

        }
    }
}

