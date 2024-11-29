using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ArticleDto
    {
        public int ID { get; set; }
        [Required]
        [MinLength(1, ErrorMessage = "Name has to be more than 0 characters")]
        [MaxLength(100, ErrorMessage = "Name cant be more than 100 characters")]
        public string? Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public int ArticleTypeID { get; set; }
        [Required]
        public string? ArticleNumber { get; set; }
        public ArticleTypeDto? ArticleType { get; set; }
    }
}
