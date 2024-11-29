using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class ArticleRepository : BaseRepository<Article>, IArticleRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public ArticleRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Articles)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<Article>> GetArticleByNameFilter(string name)
        {
            List<Article> articles = await dbContext.Articles.ToListAsync();
            List<Article> art = articles.Where((article) => article.Name.ToLower().Contains(name.ToLower())).ToList();
            return art;
        }

        public async Task<List<Article>> GetArticleByNumberFilter(string articleNumber)
        {
            List<Article> articles = await dbContext.Articles.ToListAsync();
            List<Article> art = articles.Where((article) => article.ArticleNumber.Contains(articleNumber)).ToList();
            return art;
        }
    }

}
