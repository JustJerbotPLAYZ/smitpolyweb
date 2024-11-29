using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class AddressTypeConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.StreetName);
            builder.Property(x => x.HouseNumber);
            builder.Property(x => x.Addition);
            builder.Property(x => x.PostalCode);
            builder.Property(x => x.City);
            builder.Property(x => x.Country);
        }
    }
}
