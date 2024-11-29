using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class PasswordHistoryTypeConfiguration : IEntityTypeConfiguration<PasswordHistory>
    {
        public void Configure(EntityTypeBuilder<PasswordHistory> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.OldPasswordHash);
            builder.Property(x => x.ActivationDate);
            builder.Property(x => x.UserID);
            builder.HasOne(x => x.User)
                .WithMany(u => u.previouslyUsedPasswords)
                .HasForeignKey(x => x.UserID)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Property(x => x.ExpirationDate);
        }
    }
}