using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class ChecklistTypeConfiguration : IEntityTypeConfiguration<Checklist>
    {
        public void Configure(EntityTypeBuilder<Checklist> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.Property(x => x.ChecklistFieldIDs);
            builder.Property(x => x.ChecklistPropertyIDs);
            builder.HasMany(x => x.Fields).WithOne();
            builder.HasMany(x => x.Properties).WithOne();
        }
    }
}