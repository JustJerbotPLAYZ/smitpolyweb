using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class PropertyChoise : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string Value { get; set; }
        [ForeignKey("PropertyID")]
        public int PropertyID { get; set; }
        public Property Property { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region contructor

        public PropertyChoise(int propertyID, string value)
        {
            PropertyID = propertyID;
            Value = value;
        }
        #endregion constructor
    }
}
