using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CustomerFilterDto
    {

        public string? Email { get; set; }
        public string? DebtorNumber { get; set; }
        public string? SearchName { get; set; }
        public string? CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FaxNumber { get; set; }

    }
}
