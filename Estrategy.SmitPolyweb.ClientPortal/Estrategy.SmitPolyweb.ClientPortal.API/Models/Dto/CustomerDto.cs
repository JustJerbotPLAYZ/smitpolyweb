using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CustomerDto
    {
        public int ID { get; set; }
        [Required]
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }
        [Required]
        public string? DebtorNumber { get; set; }
        [Required]
        [MaxLength(100, ErrorMessage = "Name can't be more than 100 characters")]
        public string? SearchName { get; set; }
        [Required]
        [MaxLength(100, ErrorMessage = "Name can't be more than 100 characters")]
        public string? CustomerName { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }
        public string? FaxNumber { get; set; }
        [Required]
        public int? CertificateEmailSettings { get; set; }
        [Required]
        public int? CertificateExpirationReminder { get; set; }
        public int? LogoID { get; set; }
        [Required]
        public int? AddressID { get; set; }
        public AddressDto? Address { get; set; }
    }
}
