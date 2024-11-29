using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces
{
    public interface ICertificateService
    {
        Task<PaginationRequest<Certificate>> GetAllFilteredAsync(CertificateFilterDto certificateDto);

        Task<Certificate?> GetCertificateByIDAsync(int ID);
    }
}
