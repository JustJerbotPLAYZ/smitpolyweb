using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class LogoRepository : ILogoRepository
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly HttpRequest Request;
        private readonly EstrategyPolywebDbContext dbContext;

        public LogoRepository(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, EstrategyPolywebDbContext dbContext)
        {
            if (httpContextAccessor.HttpContext == null)
                throw new Exception("A logo was uploaded without a http request which should be impossible, yet it happened anyways?");

            this.webHostEnvironment = webHostEnvironment;
            Request = httpContextAccessor.HttpContext.Request;
            this.dbContext = dbContext;
        }

        public async Task<Logo> Upload(Logo image)
        {
            string localPath = Path.Combine(webHostEnvironment.ContentRootPath, "Images", $"{image.FileName}{image.FileExtension}");

            using (FileStream steam = new(localPath, FileMode.Create))
                if (image.File != null)
                    await image.File.CopyToAsync(steam);

            string urlPath = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{image.FileName}{image.FileExtension}";

            image.FilePath = urlPath;

            await dbContext.Logos.AddAsync(image);
            await dbContext.SaveChangesAsync();
            return image;
        }
    }
}
