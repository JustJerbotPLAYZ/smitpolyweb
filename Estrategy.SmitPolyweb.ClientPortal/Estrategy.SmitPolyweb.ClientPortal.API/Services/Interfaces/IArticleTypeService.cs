using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.Identity.Client;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces
{
    public interface IArticleTypeService
    {

        public Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByArticleTypeID(ArticleType articleType);
    }
}
