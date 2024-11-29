using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class AddressDto
    {
        public int? ID { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "StreetName cant be less than 1 character")]
        [MaxLength(50, ErrorMessage = "StreetName cant be more than 50 characters")]
        public string? StreetName { get; set; }
        [Required]
        public int HouseNumber { get; set; }
        public string? Addition { get; set; }
        [Required]
        [MinLength(6, ErrorMessage = "PostalCode needs to be 6 characters")]
        [MaxLength(6, ErrorMessage = "PostalCode needs to be 6 characters")]
        public string? PostalCode { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "CityName has to be minimum 1 character")]
        [MaxLength(200, ErrorMessage = "CityName cant have more than 200 characters ")]
        public string? City { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "Country cant be less than 1 character")]
        [MaxLength(100, ErrorMessage = "Country cant have more than 100 characters")]
        public string? Country { get; set; }


    }
}

