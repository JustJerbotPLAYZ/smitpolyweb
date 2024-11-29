using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificatePropertyDto
    {
        public int ID { get; set; }
        public string? Value { get; set; }
        [Required]
        public int CertificateID { get; set; }
        [Required]
        public int PropertyID { get; set; }
        public CertificateDto? Certificate { get; set; }
        public PropertyDto? Property { get; set; }
    }
}
