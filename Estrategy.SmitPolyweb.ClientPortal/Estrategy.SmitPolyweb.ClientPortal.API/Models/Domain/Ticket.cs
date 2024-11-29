using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain
{
    public class Ticket : IIdEntity
    {
        #region properties
        public int ID { get; set; }
        public int TicketNumber { get; set; }
        public string? Description { get; set; }
        public DateTime Scheduled { get; set; }
        public TicketStatus Status { get; set; }
        public int ArticleID { get; set; }
        public int CustomerID { get; set; }
        public int UserID { get; set; }
        public int AddressID { get; set; }
        public string? CustomerSearchName { get; set; }
        public string? UserFirstName { get; set; }

        // Navigational Properties
        public Article? Article { get; set; }
        public Customer? Customer { get; set; }
        public User? User { get; set; }
        public Address? Address { get; set; }

        #endregion properties

        #region tracking

        public int CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime LastModified { get; set; }

        #endregion tracking

        #region constructors

        public Ticket(int ticketNumber, string? description, DateTime scheduled, TicketStatus status, int articleID,
             int customerID, int userID, int addressID, string customerSearchName, string userFirstName)
        {
            TicketNumber = ticketNumber;
            Description = description;
            Scheduled = scheduled;
            Status = status;
            ArticleID = articleID;
            CustomerID = customerID;
            UserID = userID;
            AddressID = addressID;
            CustomerSearchName = customerSearchName;
            UserFirstName = userFirstName;
        }

        #endregion construcors
    }
}
