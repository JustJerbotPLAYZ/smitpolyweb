using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificateDto
    {
        public int ID { get; set; }
        [Required]
        public int CertificateTypeID { get; set; }
        public int CustomerID { get; set; }
        public int SupplierID { get; set; }
        public int ArticleTypeID { get; set; }
        [Required]
        public string? WorkType { get; set; }
        public DateTime? DateOfInspection { get; set; }
        [Required]
        public DateTime SupplyDate { get; set; }
        public CertificateStatus? Status { get; set; }
        public string? ExtraInfo { get; set; }
        public string CustomerReferenceNumber { get; set; }
        public string? CustomerSearchName { get; set; }
        public string? Description { get; set; }
        public DateTime? ExpirationDate { get; set; }
        [Required]
        public int RegistrationNumber { get; set; }
        public int ArticleID { get; set; }
        [Required]
        public int SupplierAddressID { get; set; }
        [Required]
        public int CustomerAddressID { get; set; }
        [Required]
        public string DebtorNumber { get; set; }

        public CustomerDto? Customer { get; set; }
        public CertificateTypeDto? CertificateType { get; set; }
        public AddressDto? CustomerAddress { get; set; }
        public AddressDto? SupplierAddress { get; set; }
        public SupplierDto? Supplier { get; set; }
        public ArticleDto? Article { get; set; }
        public ArticleTypeDto? ArticleType { get; set; }
        public List<CertificatePropertyDto>? Properties { get; set; }
    }
}
