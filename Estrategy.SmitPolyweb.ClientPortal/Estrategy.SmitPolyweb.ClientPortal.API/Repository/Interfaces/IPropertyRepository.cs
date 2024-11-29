using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IPropertyRepository : IBaseRepostory<Property>
    {
        Task<List<Property?>> GetPropertiesByIDAsync(List<int> Properties);

    }
}
