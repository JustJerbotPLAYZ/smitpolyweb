using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class RefreshTokenTypeConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.OwnerID);
            builder.Property(x => x.RefreshTokenValue);
            builder.Property(x => x.TokenID);
            builder.Property(x => x.ValidUntill);
            builder.HasOne(x => x.Token)
                   .WithOne(t => t.RefreshToken)
                   .HasForeignKey<Token>(t => t.RefreshTokenID);
        }
    }
}