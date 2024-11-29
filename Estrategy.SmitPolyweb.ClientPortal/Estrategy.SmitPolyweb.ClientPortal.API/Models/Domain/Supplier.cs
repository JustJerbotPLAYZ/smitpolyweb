using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Supplier : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string Name { get; set; }
        public int AddressID { get; set; }

        // Navigational Properties
        public Address Address { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Supplier(string name, int addressID)
        {
            Name = name;
            AddressID = addressID;
        }

        #endregion constructors
    }
}
