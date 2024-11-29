using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class ArticleTypeConfiguration : IEntityTypeConfiguration<Article>
    {
        public void Configure(EntityTypeBuilder<Article> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.ArticleNumber).IsUnique();
            builder.Property(x => x.Name);
            builder.Property(x => x.Description);
            builder.HasOne(x => x.ArticleType);
        }
    }
}
