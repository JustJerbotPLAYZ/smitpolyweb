using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Article : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string ArticleNumber { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int ArticleTypeID { get; set; }
        // Navigational Properties
        public ArticleType? ArticleType { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Article(string name, string? description, string articleNumber, int articleTypeID)
        {
            Name = name;
            ArticleNumber = articleNumber;
            Description = description;
            ArticleTypeID = articleTypeID;
        }

        #endregion constructors
    }
}

