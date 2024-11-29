using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class SupplierDto
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public int AddressID { get; set; }
        public AddressDto? Address { get; set; }
    }
}
