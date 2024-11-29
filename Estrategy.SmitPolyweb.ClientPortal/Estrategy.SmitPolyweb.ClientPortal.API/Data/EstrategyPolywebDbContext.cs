using Estrategy.SmitPolyweb.ClientPortal.API.DomainDataMapping;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace Estrategy.SmitPolyweb.ClientPortal.API.Data
{
    public class EstrategyPolywebDbContext : DbContext
    {


        public User? CurrentUser { get; set; }

        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public EstrategyPolywebDbContext(DbContextOptions<EstrategyPolywebDbContext> dbContextOptions) : base(dbContextOptions)
        {

        }


        public DbSet<Address> Addresses { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<CertificateType> CertificateTypes { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleType> ArticleTypes { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Checklist> Checklists { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<ChecklistField> ChecklistFields { get; set; }
        public DbSet<PasswordHistory> PasswordHistories { get; set; }
        public DbSet<Logo> Logos { get; set; }
        public DbSet<PropertyChoise> PropertyChoises { get; set; }
        public DbSet<ArticleTypeProperty> ArticleTypeProperties { get; set; }
        public DbSet<CertificateProperty> CertificateProperties { get; set; }
        public DbSet<CertificateTicket> CertificateTickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AddressTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ArticleTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ArticleTypePropertiesTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ArticleTypeTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CertificateTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CertificateTypeTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ChecklistFieldTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ChecklistTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CustomerTypeConfiguration());
            modelBuilder.ApplyConfiguration(new LogoTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PasswordHistoryTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PropertyTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RefreshTokenTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RoleTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SupplierTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TicketTypeConfiguration());
            modelBuilder.ApplyConfiguration(new TokenTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PropertyChoiseTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AddressTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CertificatePropertiesTypeConfiguration());


            //modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            //modelBuilder.Entity<Customer>().HasIndex(u => u.Email).IsUnique();
            //modelBuilder.Entity<Role>().HasIndex(u => u.Name).IsUnique();
            //modelBuilder.Entity<Article>().HasIndex(u => u.ArticleNumber).IsUnique();
            //base.OnModelCreating(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected void OnBeforeSaving()
        {
            if (CurrentUser != null)
            {
                foreach (EntityEntry changedEntity in ChangeTracker.Entries())
                {
                    if (changedEntity.Entity is IIdEntity entity)
                    {
                        DateTime now = DateTime.Now;
                        switch (changedEntity.State)
                        {
                            case EntityState.Added:
                                entity.CreationDate = now;
                                entity.LastModified = now;
                                entity.CreatedBy = CurrentUser.ID;
                                entity.ModifiedBy = CurrentUser.ID;
                                break;
                            case EntityState.Modified:
                                Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                                Entry(entity).Property(x => x.CreationDate).IsModified = false;
                                entity.LastModified = now;
                                entity.ModifiedBy = CurrentUser.ID;
                                break;
                        }
                    }
                    if (changedEntity.Entity is User user)
                    {
                        if (user.PasswordHashType == PasswordHashType.NotSet)
                        {
                            string hashedPassword = PasswordHelper.GenerateSaltedPassword(user.Password, user.CreationDate.ToString());

                            user.Password = hashedPassword;
                            user.PasswordHashType = PasswordHashType.Salted;

                            user.previouslyUsedPasswords.Add(new(hashedPassword, CurrentUser.ID));

                        }
                    }
                }
            }
            //TODO://else throw new UserNotLoggedInException("There is no user logged in but there was still an attempt to save data! is your token still valid?");
        }
    }
}
