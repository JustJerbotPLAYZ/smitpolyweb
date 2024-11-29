using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificateTypeDto
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
