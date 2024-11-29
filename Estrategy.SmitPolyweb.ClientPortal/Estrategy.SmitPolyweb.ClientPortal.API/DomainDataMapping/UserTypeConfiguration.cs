using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class UserTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.ID);
            builder.HasIndex(x => x.Email).IsUnique();
            builder.Property(x => x.Password);
            builder.Property(x => x.PasswordHashType);
            builder.Property(x => x.FirstName);
            builder.Property(x => x.Infix);
            builder.Property(x => x.LastName);
            builder.Property(x => x.RoleID);
            builder.Property(x => x.RefreshTokenID);
            builder.Property(x => x.CustomerID);
            builder.HasOne(x => x.Customer);
            builder.HasOne(x => x.RefreshToken)
                   .WithOne(x => x.Owner)
                   .HasForeignKey<User>(x => x.RefreshTokenID);
            builder.HasOne(x => x.Role);
            builder.Property(x => x.CreatedBy);
            builder.Property(x => x.CreationDate);
            builder.Property(x => x.ModifiedBy);
            builder.Property(x => x.LastModified);
            builder.Property(x => x.AccountActive);
            builder.Property(x => x.AccountBlocked);
            builder.HasMany(x => x.previouslyUsedPasswords)
                .WithOne(pup => pup.User)
                .HasForeignKey(pup => pup.UserID)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}