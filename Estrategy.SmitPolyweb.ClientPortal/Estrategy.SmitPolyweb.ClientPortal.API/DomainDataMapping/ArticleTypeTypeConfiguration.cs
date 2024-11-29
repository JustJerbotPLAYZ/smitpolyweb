using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class ArticleTypeTypeConfiguration : IEntityTypeConfiguration<ArticleType>
    {
        public void Configure(EntityTypeBuilder<ArticleType> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Name);
            builder.Property(x => x.StandardPrice);
            builder.HasMany(x => x.Properties);
        }
    }
}
