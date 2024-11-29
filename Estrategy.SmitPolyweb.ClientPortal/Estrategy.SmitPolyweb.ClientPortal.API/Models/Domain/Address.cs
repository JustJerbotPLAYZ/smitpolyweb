using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Address : IIdEntity
    {
        #region properties

        public int ID { get; set; }
        public string StreetName { get; set; }
        public int HouseNumber { get; set; }
        public string? Addition { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Address(string streetName, int houseNumber, string postalCode, string city, string country, string? addition = null)
        {
            StreetName = streetName;
            HouseNumber = houseNumber;
            Addition = addition;
            PostalCode = postalCode;
            City = city;
            Country = country;
        }

        #endregion constructors
    }
}
