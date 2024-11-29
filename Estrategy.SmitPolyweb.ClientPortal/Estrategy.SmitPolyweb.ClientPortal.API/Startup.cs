using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Mappings;
using Estrategy.SmitPolyweb.ClientPortal.API.Middlewares;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Tokens;
using Estrategy.SmitPolyweb.ClientPortal.API.Services;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MySql.Data.MySqlClient;
using NLog;
using NLog.Extensions.Logging;
using System.Text;
using System.Text.Json.Serialization;

namespace Estrategy.SmitPolyweb.ClientPortal.API
{
    public class Startup
    {
        private readonly IConfiguration config;
        private readonly Logger logger;

        public Startup(IConfiguration config)
        {
            this.config = config;
            logger = LogManager.GetCurrentClassLogger();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                                                .AddJsonFile("appsettings.json", optional: true)
                                                .AddJsonFile("appsettings.Development.json", optional: true)
                                                .AddJsonFile("appsettings.local.json", optional: true)
                                                .AddEnvironmentVariables()
                                                .Build();
            string? connectionString = configuration.GetConnectionString("EstrategyPolywebConnectionString");

            JwtSettings? jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("https://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
                    });
            });
            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException(connectionString, "There is no connection string yet there should've been one");

            if (jwtSettings == null)
                throw new ArgumentNullException(nameof(jwtSettings), "There are no JwtSettings yet they should exist");

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                });
            services.AddHttpContextAccessor();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.EnableAnnotations();
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Smit Polyweb API",
                    Version = "V1"
                });
                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = JwtBearerDefaults.AuthenticationScheme
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = JwtBearerDefaults.AuthenticationScheme
                            },
                            Scheme = "Oauth2",
                            Name = JwtBearerDefaults.AuthenticationScheme,
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });

            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();
                loggingBuilder.AddNLog();
            });

            services.AddSingleton(jwtSettings);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
            });

            services.AddDbContext<EstrategyPolywebDbContext>(options =>
            {
                options.UseMySQL(connectionString, providerOptions =>
                {
                    providerOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                });
                options.EnableSensitiveDataLogging();
                options.LogTo(msg => logger.Info(msg), Microsoft.Extensions.Logging.LogLevel.Information);
            });


#if DEBUG
            //Makes sql file  from the database on run add your own name password and filepath to use
            try
            {
                string file = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "script.sql");
                using (MySqlConnection conn = new MySqlConnection(connectionString))
                {
                    conn.Open();
                    using (MySqlCommand cmd = new())
                    {
                        cmd.Connection = conn;
                        using (MySqlBackup mb = new(cmd))
                        {
                            mb.ExportToFile(file);
                            logger.Info("Data was added in sql file");
                        }
                    }
                    conn.Close();
                }
            }
            catch (Exception)
            {
                logger.Error("Was not able to create the sql file!");
            }
#endif

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<ITokenRepository, TokenRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<ILogoRepository, LogoRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();
            services.AddScoped<ICertificateRepository, CertificateRepository>();
            services.AddScoped<ICertificateTypeRepository, CertificateTypeRepository>();
            services.AddScoped<IArticleRepository, ArticleRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            services.AddScoped<IArticleTypeRepository, ArticleTypeRepository>();
            services.AddScoped<IChecklistRepository, ChecklistRepository>();
            services.AddScoped<IPropertyRepository, PropertyRepository>();
            services.AddScoped<IChecklistFieldRepository, ChecklistFieldRepository>();
            services.AddScoped<IPasswordHistoryRepository, PasswordHistoryRepository>();
            services.AddScoped<IArticleTypePropertyRepository, ArticleTypePropertyRepository>();
            services.AddScoped<ICertificateTicketRepository, CertificateTicketRepository>();
            services.AddScoped<IPropertyChoiseRepository, PropertyChoiseRepository>();
            services.AddScoped<ICertificatePropertyRespository, CertificatePropertyRepository>();

            // Services
            services.AddScoped<IArticleTypeService, ArticleTypeService>();
            services.AddScoped<IPropertyService, PropertyService>();
            services.AddScoped<ICertificateService, CertificateService>();


            // Mapper
            services.AddAutoMapper(typeof(AutoMapperProfiles));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, EstrategyPolywebDbContext dbContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // make sure database connection is established and ready for transactions
                //System.Threading.Thread.Sleep(5000);
                dbContext.Database.Migrate();
                dbContext.Seed();

                //Change the number here to edit the amount of certificates to make
                //if (dbContext.Certificates.Count() < 50000)
                //InitialData.AddMoreCertificates(dbContext, 50000);
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });

            app.UseSwagger();
            app.UseSwaggerUI();

            // Exception handling middleware should be configured early
            app.UseMiddleware<ExceptionHandlerMiddleware>();
            app.UseMiddleware<UserTrackerMiddleware>();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            string dir = Path.Combine(Directory.GetCurrentDirectory(), "Images");
            if (!File.Exists(dir))
                Directory.CreateDirectory(dir);

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(dir),
                RequestPath = "/Images"
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToFile("/index.html");
            });
        }
    }
}
