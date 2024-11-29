using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{

    public class PropertyTypeConfiguration : IEntityTypeConfiguration<Property>
    {
        public void Configure(EntityTypeBuilder<Property> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.Property(x => x.EnglishName);
            builder.Property(x => x.PropertyName);
            builder.Property(x => x.FieldType);
            builder.HasMany(x => x.PropertyChoises);
        }
    }
}
