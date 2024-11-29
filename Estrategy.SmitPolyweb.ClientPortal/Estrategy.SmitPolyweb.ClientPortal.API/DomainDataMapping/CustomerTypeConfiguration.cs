using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class CustomerTypeConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.Email).IsUnique();
            builder.Property(x => x.DebtorNumber);
            builder.Property(x => x.SearchName);
            builder.Property(x => x.CustomerName);
            builder.Property(x => x.PhoneNumber);
            builder.Property(x => x.FaxNumber);
            builder.Property(x => x.CertificateEmailSettings);
            builder.Property(x => x.CertificateExpirationReminder);
            builder.Property(x => x.SalePercentage);
            builder.Property(x => x.LogoID);
            builder.Property(x => x.AddressID);
            builder.HasOne(x => x.Logo);
            builder.HasOne(x => x.Address);
        }
    }
}