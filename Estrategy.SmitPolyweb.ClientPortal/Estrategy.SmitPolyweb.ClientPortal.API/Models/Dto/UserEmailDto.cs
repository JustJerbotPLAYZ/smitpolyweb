

using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class UserEmailDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

    }
}