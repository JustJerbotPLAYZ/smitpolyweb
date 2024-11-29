using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificateFilterDto
    {
        [Required]
        public int? Amount { get; set; }
        [Required]
        public int? ToSkip { get; set; }

        public int? RegistrationNumber { get; set; }
        public string? DebtorNumber { get; set; }
        public string? CustomerSearchName { get; set; }
        public string? CustomerReferenceNumber { get; set; }
        public string? Description { get; set; }
        public string? ExtraInfo { get; set; }
        public DateTime? SearchDate { get; set; }
        public bool AllCertificates { get; set; }
        public bool AfterMonth { get; set; }
        public bool DuringMonth { get; set; }
        public bool Expired { get; set; }
        public bool Disapproved { get; set; }
        public bool OutofOrder { get; set; }
    }
}
