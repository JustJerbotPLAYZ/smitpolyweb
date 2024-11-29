using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Customer : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public string Email { get; set; }
        public string DebtorNumber { get; set; }
        public string SearchName { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string? FaxNumber { get; set; }
        public int CertificateEmailSettings { get; set; }
        public int CertificateExpirationReminder { get; set; }
        public int SalePercentage { get; set; }
        public int? LogoID { get; set; }
        public int AddressID { get; set; }

        // Navigational Properties
        public Logo? Logo { get; set; }
        public Address? Address { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Customer(string email, string debtorNumber, string searchName, string customerName,
            string phoneNumber, string faxNumber, int certificateEmailSettings, int certificateExpirationReminder,
            int addressID, Logo? logo = null)
        {
            Email = email;
            DebtorNumber = debtorNumber;
            SearchName = searchName;
            CustomerName = customerName;
            PhoneNumber = phoneNumber;
            FaxNumber = faxNumber;
            CertificateEmailSettings = certificateEmailSettings;
            CertificateExpirationReminder = certificateExpirationReminder;
            Logo = logo;
            AddressID = addressID;
        }


        /// <summary>
        /// Entity framework core specific constructor as "It CaNnOt SeT nAvIgAtIoNaL pRoPpErTiEs"
        /// </summary>
        private Customer(string email, string debtorNumber, string searchName, string customerName,
            string phoneNumber, string faxNumber, int certificateEmailSettings, int certificateExpirationReminder)
        {
            Email = email;
            DebtorNumber = debtorNumber;
            SearchName = searchName;
            CustomerName = customerName;
            PhoneNumber = phoneNumber;
            FaxNumber = faxNumber;
            CertificateEmailSettings = certificateEmailSettings;
            CertificateExpirationReminder = certificateExpirationReminder;
        }

        #endregion constructors
    }
}
