using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IArticleTypePropertyRepository : IBaseRepostory<ArticleTypeProperty>
    {
        Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByIDs(ArticleTypePropertyFilterDto articleTypePropertyIDs);
    }
}
