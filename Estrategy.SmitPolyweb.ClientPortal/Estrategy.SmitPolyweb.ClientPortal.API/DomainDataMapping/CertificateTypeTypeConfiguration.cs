using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class CertificateTypeTypeConfiguration : IEntityTypeConfiguration<CertificateType>
    {
        public void Configure(EntityTypeBuilder<CertificateType> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.Property(x => x.Description);
        }
    }
}