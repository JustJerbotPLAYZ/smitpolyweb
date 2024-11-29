using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ILogoRepository
    {
        Task<Logo> Upload(Logo image);
    }
}
