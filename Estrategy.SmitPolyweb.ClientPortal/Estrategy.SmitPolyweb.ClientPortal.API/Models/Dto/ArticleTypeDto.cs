using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ArticleTypeDto
    {
        public int ID { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "Name has to be more than 0 characters")]
        [MaxLength(100, ErrorMessage = "Name cant be more than 100 characters")]
        public string? Name { get; set; }
        public double StandardPrice { get; set; }
        public List<ArticleTypePropertyDto>? Properties { get; set; }
    }
}
