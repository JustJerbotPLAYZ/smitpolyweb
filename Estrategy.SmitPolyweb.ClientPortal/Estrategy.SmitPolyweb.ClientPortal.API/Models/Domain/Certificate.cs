using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Certificate : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public int RegistrationNumber { get; set; }
        public int CertificateTypeID { get; set; }
        public int CustomerID { get; set; }
        public int SupplierID { get; set; }
        public int? SupplierAddressID { get; set; }
        public int ArticleID { get; set; }
        public int? CustomerAddressID { get; set; }
        public DateTime? DateOfInspection { get; set; }
        public string? CustomerSearchName { get; set; }
        public string? Description { get; set; }
        public string WorkType { get; set; }
        public DateTime SupplyDate { get; set; }
        public string? ExtraInfo { get; set; }
        public string DebtorNumber { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string CustomerReferenceNumber { get; set; }

        public CertificateStatus Status { get; set; }

        // Navigational properties
        public Customer? Customer { get; set; }
        public CertificateType CertificateType { get; set; }
        public Address SupplierAddress { get; set; }
        public Address CustomerAddress { get; set; }
        public Supplier Supplier { get; set; }
        public Article Article { get; set; }

        public List<CertificateProperty> Properties { get; set; }


        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Certificate() // NOTE: ef needs empty constructor for instanciation
        {

        }

        public Certificate(int certificateTypeID, int supplierAddressID, int customerAddressID, int customerID, int supplierID, string workType,
            DateTime supplyDate, string? extraInfo, DateTime expirationDate, int registrationNumber, string debtorNumber, int articleID,
            string? description, string? customerSearchName, string customerReferenceNumber, DateTime? dateOfInspection)
        {
            CertificateTypeID = certificateTypeID;
            SupplierAddressID = supplierAddressID;
            CustomerAddressID = customerAddressID;
            CustomerID = customerID;
            SupplierID = supplierID;
            WorkType = workType;
            SupplyDate = supplyDate;
            ExtraInfo = extraInfo;
            ExpirationDate = expirationDate;
            RegistrationNumber = registrationNumber;
            DebtorNumber = debtorNumber;
            ArticleID = articleID;
            Description = description;
            CustomerSearchName = customerSearchName;
            CustomerReferenceNumber = customerReferenceNumber;
            DateOfInspection = dateOfInspection;
        }

        #endregion constructors
    }
}
