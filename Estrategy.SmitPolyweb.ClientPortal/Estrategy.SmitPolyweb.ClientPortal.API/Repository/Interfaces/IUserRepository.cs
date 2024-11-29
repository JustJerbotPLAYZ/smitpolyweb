using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IUserRepository : IBaseRepostory<User>
    {
        Task<User?> GetByEmailAsync(string Email);
        Task<User?> GetUsersPasswordHistory(int id);
        Task<User?> UpdateUserPassword(User user, User newUser);
    }
}
