using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class RoleTypeConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.Name).IsUnique();
            builder.Property(x => x.CreatedBy);
            builder.Property(x => x.CreationDate);
            builder.Property(x => x.ModifiedBy);
            builder.Property(x => x.LastModified);
            builder.Property(x => x.Permissions);

        }
    }
}