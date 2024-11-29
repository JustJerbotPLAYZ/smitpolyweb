using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.Identity.Client;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces
{
    public interface IPropertyService
    {
        public Task<List<Property>> GetPropertyWithArticleTypesAsync();

        public Task<Property?> GetPropertyWithArticleTypesByIDAsync(int ID);

        public Task<Property?> UpdatePropertyAsync(int ID, Property updated);

        public Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByPropertyID(Property property);

        public Task<List<Property?>> GetAvailableProperties(ArticleType articleType);
    }
}
