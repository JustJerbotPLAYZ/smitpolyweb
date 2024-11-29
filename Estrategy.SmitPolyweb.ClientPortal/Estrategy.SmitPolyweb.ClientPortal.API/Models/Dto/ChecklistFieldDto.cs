using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ChecklistFieldDto
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public bool Checked { get; set; }
        [Required]
        public int ChecklistID { get; set; }
    }
}
