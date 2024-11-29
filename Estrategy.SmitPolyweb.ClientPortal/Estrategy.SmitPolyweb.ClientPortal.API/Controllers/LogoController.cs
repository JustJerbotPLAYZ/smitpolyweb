using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoController : ControllerBase
    {
        private readonly ILogoRepository LogoRepository;
        private readonly IMapper Mapper;

        public LogoController(ILogoRepository LogoRepository, IMapper Mapper)
        {
            this.LogoRepository = LogoRepository;
            this.Mapper = Mapper;
        }

        /// <summary>
        /// Uploads a Photo to the API so companies can use it as logo on their certificated, this endpoint is accesible through:
        /// POST: /api/Logo/Upload/
        /// </summary>
        /// <param name="uploadRequest">The file to upload to the server</param>
        /// <returns>An Ok 200 response if the upload was succesfull, or a Bad Request 400 if it wasn't</returns>
        [HttpPost]
        [Route("Upload")]
        [Authorize(Roles = nameof(Permission.ImageUpload))]
        public async Task<IActionResult> Upload([FromForm] LogoDto uploadRequest)
        {
            if (uploadRequest.File != null)
            {
                ValidateFileUpload(uploadRequest);

                if (ModelState.IsValid)
                {
                    Logo imageDomainModel = new(uploadRequest.File, uploadRequest.FileName.Replace(" ", "_"), uploadRequest.File.Length)
                    {
                        FileDescription = uploadRequest.FileDescription,
                        FileExtension = Path.GetExtension(uploadRequest.File.FileName)
                    };

                    await LogoRepository.Upload(imageDomainModel);

                    return Ok(Mapper.Map<LogoDto>(imageDomainModel));
                }
            }
            return BadRequest("Something went wrong while uploading your logo");
        }

        /// <summary>
        /// A validation method to check if the Photo matches some certain parameters, there are: <br/>
        ///  - Matches the allowed extensions (jpg, jpeg and png) <br/>
        ///  - Is smaller then 10 megabytes
        /// </summary>
        /// <param name="validationRequest">The file to validate</param>
        private void ValidateFileUpload(LogoDto validationRequest)
        {
            string[] allowedExtensions =
            {
                ".jpg", ".jpeg", ".png"
            };
            if (!allowedExtensions.Contains(Path.GetExtension(validationRequest.File.FileName)))
            {
                ModelState.AddModelError("file", "Unsupported file extension");
            }

            if (validationRequest.File.Length > 10485760)
            {
                ModelState.AddModelError("file", "File size more than 10MB");
            }
        }
    }
}
