using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ICertificateRepository : IBaseRepostory<Certificate>
    {
        Task<List<Certificate>> GetRemindersAsync(ReminderDto reminderDto);
    }
}
