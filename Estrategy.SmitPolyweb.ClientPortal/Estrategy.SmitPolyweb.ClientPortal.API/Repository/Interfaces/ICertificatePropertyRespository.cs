using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface ICertificatePropertyRespository : IBaseRepostory<CertificateProperty>
    {
        Task<List<CertificateProperty?>> GetCertificatePropertiesByCertificateID(int ID);

        Task<CertificateProperty> GetCertificatePropertyByIDs(int certificateID, int propertyID);
    }
}
