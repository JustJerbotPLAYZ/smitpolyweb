using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public PropertyService(EstrategyPolywebDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<List<Property>> GetPropertyWithArticleTypesAsync()
        {
            return await dbContext.Properties.ToListAsync();
        }

        public async Task<Property?> GetPropertyWithArticleTypesByIDAsync(int ID)
        {
            return await dbContext.Properties.FirstOrDefaultAsync(x => x.ID == ID);
        }

        public async Task<Property?> UpdatePropertyAsync(int ID, Property updated)
        {
            Property? existingEntity = await GetPropertyWithArticleTypesByIDAsync(ID);
            if (existingEntity != null)
            {
                updated.ID = existingEntity.ID;
                //existingEntity.ArticleType = updated.ArticleType;
                dbContext.Entry(existingEntity).CurrentValues.SetValues(updated);
                await dbContext.SaveChangesAsync();
            }
            return existingEntity;
        }

        public async Task<List<ArticleTypeProperty?>> GetArticleTypePropertyByPropertyID(Property property)
        {
            List<ArticleTypeProperty>? articleTypeProperty = dbContext.ArticleTypeProperties.Where((articleTypeProp) => articleTypeProp.PropertyID == property.ID).ToList();
            return articleTypeProperty;

        }

        public async Task<List<Property?>> GetAvailableProperties(ArticleType articleType)
        {
            List<int> tempIDList = new();
            List<ArticleTypeProperty?> articleTypeProperties = await dbContext.ArticleTypeProperties.Where((articleTypeProp) => articleTypeProp.ArticletypeID == articleType.ID).ToListAsync();

            for (int i = articleTypeProperties.Count() - 1; i >= 0; i--)
            {
                if (!tempIDList.Contains(articleTypeProperties[i].PropertyID))
                {
                    tempIDList.Add(articleTypeProperties[i].PropertyID);
                }
            }
            List<Property?> properties = await dbContext.Properties.Where((property) => !tempIDList.Contains(property.ID)).ToListAsync();
            return properties;
        }
    }
}
