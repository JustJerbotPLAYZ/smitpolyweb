namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class ArticleTypePropertyDto
    {
        public int? ID { get; set; }
        public int? ArticleTypeID { get; set; }
        public int? PropertyID { get; set; }
        public ArticleTypeDto? ArticleType { get; set; }
        public PropertyDto? Property { get; set; }
        public bool? Visable { get; set; }
        public bool? Required { get; set; }

    }
}
