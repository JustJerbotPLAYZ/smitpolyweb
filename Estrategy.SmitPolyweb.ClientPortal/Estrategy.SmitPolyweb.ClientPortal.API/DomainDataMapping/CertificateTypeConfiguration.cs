using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class CertificateTypeConfiguration : IEntityTypeConfiguration<Certificate>
    {
        public void Configure(EntityTypeBuilder<Certificate> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.RegistrationNumber).IsUnique();
            builder.Property(x => x.CustomerID);
            builder.Property(x => x.SupplierID);
            builder.Property(x => x.ArticleID);
            builder.Property(x => x.SupplierAddressID);
            builder.Property(x => x.CustomerAddressID);
            builder.Property(x => x.CustomerSearchName);
            builder.Property(x => x.Description);
            builder.Property(x => x.WorkType);
            builder.Property(x => x.SupplyDate);
            builder.Property(x => x.ExtraInfo);
            builder.Property(x => x.DebtorNumber);
            builder.Property(x => x.ExpirationDate);
            builder.Property(x => x.CustomerReferenceNumber);
            builder.Property(x => x.Status);
            builder.HasOne(x => x.Customer);
            builder.HasOne(x => x.CustomerAddress);
            builder.HasOne(x => x.SupplierAddress);
            builder.HasOne(x => x.Supplier);
            builder.HasOne(x => x.Article);
            builder.HasMany(x => x.Properties);
        }
    }
}
