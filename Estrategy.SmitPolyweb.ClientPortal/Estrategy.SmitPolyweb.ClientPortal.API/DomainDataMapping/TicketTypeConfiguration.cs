using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class TicketTypeConfiguration : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.TicketNumber).IsUnique();
            builder.Property(x => x.Description);
            builder.Property(x => x.Scheduled);
            builder.Property(x => x.Status);
            builder.Property(x => x.ArticleID);
            builder.Property(x => x.CustomerID);
            builder.Property(x => x.UserID);
            builder.Property(x => x.AddressID);
            builder.Property(x => x.CustomerSearchName);
            builder.Property(x => x.UserFirstName);
            builder.HasOne(x => x.Article);
            builder.HasOne(x => x.Customer);
            builder.HasOne(x => x.User);
            builder.HasOne(x => x.Address);
            builder.Property(x => x.CreatedBy);
            builder.Property(x => x.CreationDate);
            builder.Property(x => x.ModifiedBy);
            builder.Property(x => x.LastModified);

        }
    }
}