using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class PropertyChoiseTypeConfiguration : IEntityTypeConfiguration<PropertyChoise>
    {
        public void Configure(EntityTypeBuilder<PropertyChoise> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Value);
            builder.Property(x => x.PropertyID);
            builder.HasOne(x => x.Property);
        }

    }
}
