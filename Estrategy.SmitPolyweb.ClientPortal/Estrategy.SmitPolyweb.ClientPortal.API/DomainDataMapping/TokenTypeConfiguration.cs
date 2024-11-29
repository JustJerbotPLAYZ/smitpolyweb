using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class TokenTypeConfiguration : IEntityTypeConfiguration<Token>
    {
        public void Configure(EntityTypeBuilder<Token> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.TokenValue);
            builder.Property(x => x.RefreshTokenID);
            builder.Property(x => x.ValidUntill);
            builder.HasOne(x => x.RefreshToken)
                   .WithOne(r => r.Token)
                   .HasForeignKey<Token>(x => x.RefreshTokenID);
        }
    }
}