using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class SupplierTypeConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.HasOne(x => x.Address);
            builder.Property(x => x.CreatedBy);
            builder.Property(x => x.CreationDate);
            builder.Property(x => x.ModifiedBy);
            builder.Property(x => x.LastModified);

        }
    }
}