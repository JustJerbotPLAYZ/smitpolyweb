using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class PasswordHistoryDto
    {
        public int ID { get; set; }
        [Required]
        public string? OldPassword { get; set; }
        [Required]
        public DateTime ActivationDate { get; set; }
        [Required]
        public int UserID { get; set; }
    }
}
