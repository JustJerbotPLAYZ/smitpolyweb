using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping
{
    public class LogoTypeConfiguration : IEntityTypeConfiguration<Logo>
    {
        public void Configure(EntityTypeBuilder<Logo> builder)
        {
            builder.HasKey(x => x.ID);
            builder.Property(x => x.FileName);
            builder.Property(x => x.FileDescription);
            builder.Property(x => x.FileExtension);
            builder.Property(x => x.FileSizeInBytes);
            builder.Property(x => x.FilePath);
        }
    }
}