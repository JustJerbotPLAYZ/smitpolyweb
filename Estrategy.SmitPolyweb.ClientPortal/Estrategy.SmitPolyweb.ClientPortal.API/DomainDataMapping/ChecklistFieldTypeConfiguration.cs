using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class ChecklistFieldTypeConfiguration : IEntityTypeConfiguration<ChecklistField>
    {
        public void Configure(EntityTypeBuilder<ChecklistField> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.Property(x => x.Checked);
        }
    }
}