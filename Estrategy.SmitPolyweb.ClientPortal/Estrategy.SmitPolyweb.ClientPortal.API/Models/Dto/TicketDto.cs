using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class TicketDto
    {
        public int ID { get; set; }
        [Required]
        public int TicketNumber { get; set; }
        public string? Description { get; set; }
        [Required]
        public string? Scheduled { get; set; }
        [Required]
        public int? Status { get; set; }
        public int? ArticleID { get; set; }
        public int? CustomerID { get; set; }
        public int? UserID { get; set; }
        public int? AddressID { get; set; }
        public string? CustomerSearchName { get; set; }
        public string? UserFirstName { get; set; }

        public ArticleDto? Article { get; set; }
        public CustomerDto? Customer { get; set; }
        public UserDto? User { get; set; }
        public AddressDto? Address { get; set; }

    }
}
