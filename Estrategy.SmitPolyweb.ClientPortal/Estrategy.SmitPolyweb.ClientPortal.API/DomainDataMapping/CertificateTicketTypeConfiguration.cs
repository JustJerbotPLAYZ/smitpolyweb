using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class CertificateTicketTypeConfiguration : IEntityTypeConfiguration<CertificateTicket>
    {
        public void Configure(EntityTypeBuilder<CertificateTicket> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.CertificateID).IsRequired();
            builder.Property(x => x.TicketID).IsRequired();
        }
    }
}
