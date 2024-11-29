using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IPropertyChoiseRepository : IBaseRepostory<PropertyChoise>
    {
        Task<List<PropertyChoise>?> GetPropertyChoisesByPropertyID(Property property);
    }
}
