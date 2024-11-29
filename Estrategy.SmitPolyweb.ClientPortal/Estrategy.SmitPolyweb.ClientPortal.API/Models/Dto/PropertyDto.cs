using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class PropertyDto
    {
        public int ID { get; set; }
        [Required]
        public string? PropertyName { get; set; }
        [Required]
        public string? Name { get; set; }
        public string? EnglishName { get; set; }
        [Required]
        public int FieldType { get; set; }
        public int? ArticleTypeID { get; set; }
        public ArticleTypeDto? ArticleType { get; set; }
        public List<PropertyChoiseDto>? PropertyChoises { get; set; }
    }
}
