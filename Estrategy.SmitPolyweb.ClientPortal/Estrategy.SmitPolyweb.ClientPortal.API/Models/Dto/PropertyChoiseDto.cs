using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class PropertyChoiseDto
    {
        public int ID { get; set; }
        [Required]
        public int PropertyID { get; set; }
        public string? Value { get; set; }
        public PropertyDto? Property { get; set; }
    }
}
