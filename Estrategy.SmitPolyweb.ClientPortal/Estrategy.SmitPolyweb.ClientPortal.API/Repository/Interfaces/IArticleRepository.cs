using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IArticleRepository : IBaseRepostory<Article>
    {
        Task<List<Article>> GetArticleByNameFilter(string name);
        Task<List<Article>> GetArticleByNumberFilter(string articleNumber);
    }
}
