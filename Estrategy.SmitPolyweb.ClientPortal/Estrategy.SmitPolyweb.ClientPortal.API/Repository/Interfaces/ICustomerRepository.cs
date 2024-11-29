using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ICustomerRepository : IBaseRepostory<Customer>
    {
        Task<List<Customer>> GetAllFilteredAsync(CustomerFilterDto customerDto);
        Task<List<User>> GetAllUsersByCustomerID(int ID);
    }
}
