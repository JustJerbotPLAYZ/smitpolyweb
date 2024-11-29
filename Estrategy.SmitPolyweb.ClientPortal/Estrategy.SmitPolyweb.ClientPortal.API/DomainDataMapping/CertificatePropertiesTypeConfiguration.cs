using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class CertificatePropertiesTypeConfiguration : IEntityTypeConfiguration<CertificateProperty>
    {
        public void Configure(EntityTypeBuilder<CertificateProperty> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Value);
            builder.Property(x => x.CertificateID);
            builder.HasOne(x => x.Certificate);
            builder.Property(x => x.PropertyID);
            builder.HasOne(x => x.Property);
        }
    }
}