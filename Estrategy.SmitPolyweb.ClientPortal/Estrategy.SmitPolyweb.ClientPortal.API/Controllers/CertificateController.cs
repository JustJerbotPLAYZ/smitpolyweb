using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ICertificateRepository certificateRepository;
        private readonly IArticleRepository articleRepository;
        private readonly IArticleTypeRepository articleTypeRepository;
        private readonly IPropertyRepository propertyRepository;
        private readonly IRoleRepository roleRepository;
        private readonly ICertificateService certificateService;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public CertificateController(IMapper mapper,
            ICertificateRepository certificateRepository,
            IArticleRepository articleRepository,
            IArticleTypeRepository articleTypeRepository,
            IPropertyRepository propertyRepository,
            IRoleRepository roleRepository,
            ICertificateService certificateService)
        {
            this.mapper = mapper;
            this.certificateRepository = certificateRepository;
            this.articleRepository = articleRepository;
            this.articleTypeRepository = articleTypeRepository;
            this.propertyRepository = propertyRepository;
            this.roleRepository = roleRepository;
            this.certificateService = certificateService;
        }

        /// <summary>
        /// Searches for all the Certificates inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Certificate/
        /// </summary>
        /// <returns>An OK 200 with all the Certificates found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetAllCertificatesAsync()
        {
            //Getting data
            List<Certificate> certificateDomainModel = await certificateRepository.GetAllAsync();

            //converting Domain to Dto
            return Ok(mapper.Map<List<CertificateDto>>(certificateDomainModel));

        }

        /// <summary>
        /// A Get all request that filters over all the certificates and paginates your request so you don't overload the database
        /// GET: api/Certificate/Certificate
        /// </summary>
        /// <param name="filters">The filters to apply to the database</param>
        /// <returns>The list with certificates that the filter apply to, and the total amount that are in the database 
        /// (it can differ from the amount returned due to pagination)</returns>
        [HttpPost]
        [Route("Certificate")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetAllFilteredCertificatesAsync([FromBody] CertificateFilterDto filters)
        {
            PaginationRequest<Certificate> paginationRequest = await certificateService.GetAllFilteredAsync(filters);
            return Ok(new { Entities = mapper.Map<List<CertificateDto>>(paginationRequest.Entities), paginationRequest.TotalRecords });
        }

        [HttpPost]
        [Route("CertificateReminder")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetRemindersAsync([FromBody] ReminderDto reminderDto)
        {
            List<Certificate> reminderDomainModel = await certificateRepository.GetRemindersAsync(reminderDto);
            return Ok(mapper.Map<List<CertificateDto>>(reminderDomainModel));
        }





        /// <summary>
        /// Search for a specific Certificate in the database, this endpoint is accesible through:<br/>
        /// GET: api/Certificate/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Certificate it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetCertificateByIDAsync([FromRoute] int ID)
        {
            //Getting data
            Certificate? certificateDomainModel = await certificateService.GetCertificateByIDAsync(ID);

            //Checking if the role has value 
            if (certificateDomainModel == null)
            {
                return NotFound();
            }

            //Converting Domain to Dto
            return Ok(mapper.Map<CertificateDto>(certificateDomainModel));
        }

        /// <summary>
        /// Creates a new Certificate in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Certificate
        /// </summary>
        /// <remarks>
        /// The data used to create the Certificate is located in the Body of the request
        /// </remarks>
        /// <param name="addCertificateRequestDto">Info with which to create a new Certificate in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetCertificateByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> CreateCertificateAsync([FromBody] CertificateDto addCertificateRequestDto)
        {

            Logger.Info("Attempting to add Certificate {} to the database", addCertificateRequestDto.RegistrationNumber);

            //Convert Dto to domain
            Certificate? certificateDomainModel = mapper.Map<Certificate>(addCertificateRequestDto);

            //Create role
            certificateDomainModel = await certificateRepository.CreateAsync(certificateDomainModel);

            Logger.Info("Certificate added: {}", JsonSerializer.Serialize(certificateDomainModel));

            //Map Domain to Dto
            CertificateDto certificateDto = mapper.Map<CertificateDto>(certificateDomainModel);
            return CreatedAtAction(nameof(GetCertificateByIDAsync), new { id = certificateDto.ID }, certificateDto);
        }

        /// <summary>
        /// Updates the Certificate that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Certificate/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Certificate is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Certificate you want to update</param>
        /// <param name="updateCertificateRequestDto">The updated information for the Certificate</param>
        /// <returns>A OK 200 with the Updated Certificate</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> UpdateCertificateByIDAsync([FromRoute] int ID, [FromBody] CertificateDto updateCertificateRequestDto)
        {
            Logger.Info("Attempting to update {}", updateCertificateRequestDto.RegistrationNumber);

            //Convert Dto to Domain
            Certificate? certificateDomainModel = mapper.Map<Certificate>(updateCertificateRequestDto);
            if (certificateDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            certificateDomainModel = await certificateRepository.UpdateAsync(ID, certificateDomainModel);

            Logger.Info("Updated Certificate with: {}", JsonSerializer.Serialize(certificateDomainModel));

            //convert Domain to Dto and return it
            return Ok(mapper.Map<CertificateDto>(certificateDomainModel));
        }

        /// <summary>
        /// Delete the Certificate that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Certificate/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Certificate you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Certificate</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> DeleteCertificateByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Certificate with ID: {}", ID);

            //Deleting Certificate
            Certificate? certificateDomainModel = await certificateRepository.DeleteAsync(ID);
            if (certificateDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Certificate: {}", JsonSerializer.Serialize(certificateDomainModel));

            return Ok(mapper.Map<CertificateDto>(certificateDomainModel));
        }
    }
}
