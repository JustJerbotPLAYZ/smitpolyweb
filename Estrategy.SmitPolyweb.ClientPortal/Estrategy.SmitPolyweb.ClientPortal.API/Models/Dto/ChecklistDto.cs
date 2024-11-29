using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ChecklistDto
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public int Fields { get; set; }
    }
}
