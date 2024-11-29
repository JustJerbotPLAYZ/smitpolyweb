using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using Microsoft.Identity.Client;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling
{
    public class ArticleTypeProperty : IIdEntity
    {
        public int ID { get; set; }
        public bool Required { get; set; }
        public bool Visable { get; set; }
        public int ArticletypeID { get; set; }
        public ArticleType ArticleType { get; set; }
        public int PropertyID { get; set; }
        public Property Property { get; set; }

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking
    }
}
