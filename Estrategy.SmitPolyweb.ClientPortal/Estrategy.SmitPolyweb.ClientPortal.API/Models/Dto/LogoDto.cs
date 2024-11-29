using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class LogoDto
    {
        [Required]
        public IFormFile? File { get; set; }
        [Required]
        public string? FileName { get; set; }
        public string? FileDescription { get; set; }

    }
}
