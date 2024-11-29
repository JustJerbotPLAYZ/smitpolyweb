using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class ArticleTypePropertiesTypeConfiguration : IEntityTypeConfiguration<Models.Coupling.ArticleTypeProperty>
    {
        public void Configure(EntityTypeBuilder<Models.Coupling.ArticleTypeProperty> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.Required);
            builder.Property(x => x.Visable);
            builder.Property(x => x.ArticletypeID);
            builder.HasOne(x => x.ArticleType);
            builder.Property(x => x.PropertyID);
            builder.HasOne(x => x.Property);
        }
    }
}