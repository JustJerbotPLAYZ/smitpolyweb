using System.ComponentModel.DataAnnotations;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificateTicketDto
    {
        public int ID { get; set; }
        [Required]
        public int CertificateID { get; set; }
        [Required]
        public int TicketID { get; set; }
        public CertificateDto? Certificate { get; set; }
        public TicketDto? Ticket { get; set; }
    }
}
