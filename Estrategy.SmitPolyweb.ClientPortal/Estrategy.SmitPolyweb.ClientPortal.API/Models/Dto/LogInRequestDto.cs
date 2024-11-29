using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class LogInRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public LogInRequestDto(string Email, string Password)
        {
            this.Email = Email;
            this.Password = Password;
        }
    }
}
