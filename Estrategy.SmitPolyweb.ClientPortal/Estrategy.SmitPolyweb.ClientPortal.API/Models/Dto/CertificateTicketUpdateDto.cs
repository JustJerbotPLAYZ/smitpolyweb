namespace Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto
{
    public class CertificateTicketUpdateDto
    {
        public int OldCertificateID { get; set; }
        public int OldTicketID { get; set; }
        public int NewCertificateID { get; set; }
        public int NewTicketID { get; set; }
    }
}
