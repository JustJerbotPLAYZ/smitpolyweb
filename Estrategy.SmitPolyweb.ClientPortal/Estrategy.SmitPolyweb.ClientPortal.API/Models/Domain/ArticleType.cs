using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class ArticleType : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string Name { get; set; }
        public double StandardPrice { get; set; }
        public List<ArticleTypeProperty>? Properties { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors
        public ArticleType(string name, double standardPrice)
        {
            Name = name;
            StandardPrice = standardPrice;
        }
        #endregion constructors

    }
}
