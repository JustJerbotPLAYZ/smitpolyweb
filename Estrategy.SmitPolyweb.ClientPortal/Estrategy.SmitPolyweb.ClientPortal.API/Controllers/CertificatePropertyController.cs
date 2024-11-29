using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificatePropertyController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ICertificatePropertyRespository certificatePropertyRepository;
        private readonly IPropertyRepository propertyRepository;
        private readonly IPropertyService propertyService;
        private readonly IPropertyChoiseRepository propertyChoiseRepository;
        private readonly ICertificateRepository certificateRepository;
        private readonly IArticleTypeRepository articleTypeRepository;
        private readonly IArticleTypeService articleTypeService;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public CertificatePropertyController(IMapper mapper, ICertificatePropertyRespository certificatePropertyRepository, IPropertyRepository propertyRepository, IPropertyService propertyService, IPropertyChoiseRepository propertyChoiseRepository, ICertificateRepository certificateRepository, IArticleTypeRepository articleTypeRepository, IArticleTypeService articleTypeService)
        {
            this.mapper = mapper;
            this.certificatePropertyRepository = certificatePropertyRepository;
            this.propertyRepository = propertyRepository;
            this.propertyService = propertyService;
            this.propertyChoiseRepository = propertyChoiseRepository;
            this.certificateRepository = certificateRepository;
            this.articleTypeRepository = articleTypeRepository;
            this.articleTypeService = articleTypeService;
        }

        /// <summary>
        /// Searches for all the CertificateProperties inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateProperty/
        /// </summary>
        /// <returns>An OK 200 with all the CertificateProperties found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAllCertificatePropertiesAsync()
        {
            //Getting data 
            List<CertificateProperty> certificatePropertyDomainModel = await certificatePropertyRepository.GetAllAsync();

            //converting Domain to Dto
            return Ok(mapper.Map<List<CertificatePropertyDto>>(certificatePropertyDomainModel));
        }

        /// <summary>
        /// Search for a specific CertificateProperty in the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateProperty/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the CertificateProperty it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetCertificatePropertyByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for CertificateProperty: {}", ID);
            //Getting data
            CertificateProperty? certificatePropertyDomainModel = await certificatePropertyRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (certificatePropertyDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found CertificateProperty: {}", JsonSerializer.Serialize(certificatePropertyDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<CertificatePropertyDto>(certificatePropertyDomainModel));
        }

        /// <summary>
        /// Creates a new CertificateProperty in the Database, this endpoint is accesible through:<br/>
        /// POST: api/CertificateProperty/
        /// </summary>
        /// <remarks>
        /// The data used to create the CertificateProperty is located in the Body of the request
        /// </remarks>
        /// <param name="addCertificatePropertyRequestDto">Info with which to create a new CertificateProperty in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetCertificatePropertyByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> CreateCertificatePropertyAsync([FromBody] CertificatePropertyDto addCertificatePropertyRequestDto)
        {
            //Convert Dto to domain
            CertificateProperty? certificatePropertyDomainModel = mapper.Map<CertificateProperty>(addCertificatePropertyRequestDto);

            //Create certificateProperty
            certificatePropertyDomainModel = await certificatePropertyRepository.CreateAsync(certificatePropertyDomainModel);


            //Map Domain to Dto
            CertificatePropertyDto certificatePropertyDto = mapper.Map<CertificatePropertyDto>(certificatePropertyDomainModel);
            return CreatedAtAction(nameof(GetCertificatePropertyByIDAsync), new { id = certificatePropertyDto.ID }, certificatePropertyDto);
        }

        /// <summary>
        /// Updates the CertificateProperty that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/CertificateProperty/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the CertificateProperty is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the CertificateProperty you want to update</param>
        /// <param name="updateCertificatePropertyRequestDto">The updated information for the CertificateProperty</param>
        /// <returns>A OK 200 with the Updated CertificateProperty</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> UpdateCertificatePropertyByIDAsync([FromRoute] int ID, [FromBody] CertificatePropertyDto updateCertificatePropertyRequestDto)
        {

            //Convert Dto to Domain
            CertificateProperty? certificatePropertyDomainModel = mapper.Map<CertificateProperty>(updateCertificatePropertyRequestDto);
            if (certificatePropertyDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            certificatePropertyDomainModel = await certificatePropertyRepository.UpdateAsync(ID, certificatePropertyDomainModel);


            //convert Domain to Dto and return it
            return Ok(mapper.Map<CertificatePropertyDto>(certificatePropertyDomainModel));
        }

        /// <summary>
        /// Delete the CertificateProperty that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/CertificateProperty/{ID}
        /// </summary>
        /// <param name="ID">The ID of the CertificateProperty you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted CertificateProperty</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> DeleteCertificatePropertyByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting CertificateProperty with ID: {}", ID);

            //Deleting CertificateProperty
            CertificateProperty? certificatePropertyDomainModel = await certificatePropertyRepository.DeleteAsync(ID);
            if (certificatePropertyDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted CertificateProperty: {}", JsonSerializer.Serialize(certificatePropertyDomainModel));

            return Ok(mapper.Map<CertificatePropertyDto>(certificatePropertyDomainModel));
        }

        [HttpGet]
        [Route("GetCertificatePropertiesByCertificateID/{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetCertificatePropertiesByCertificateID([FromRoute] int ID)
        {
            //Getting data
            List<CertificateProperty?> certificatePropertyDomainModel = await certificatePropertyRepository.GetCertificatePropertiesByCertificateID(ID);

            //Converting Domain to Dto
            return Ok(mapper.Map<List<CertificatePropertyDto>>(certificatePropertyDomainModel));
        }

        [HttpPost]
        [Route("GetAllCertificatePropertyData")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAllCertificatePropertyData([FromBody] PropertyDataDto formData)
        {
            List<Property?> propertyList = new();
            List<ArticleTypeProperty?> articleTypePropertyList = new();
            List<PropertyChoise?> propertyChoisesList = new();
            List<CertificateProperty> certificatePropertiesList = new();
            List<CertificateProperty?> certificateProperties = await certificatePropertyRepository.GetCertificatePropertiesByCertificateID(formData.certificateID);
            Certificate? certificate = await certificateRepository.GetByIDAsync(formData.certificateID);
            ArticleType? articleType = await articleTypeRepository.GetByIDAsync(formData.articleTypeID);

            List<ArticleTypeProperty> articleTypeProperties = await articleTypeService.GetArticleTypePropertyByArticleTypeID(articleType);
            articleTypePropertyList.AddRange(articleTypeProperties);


            for (int i = articleTypeProperties.Count() - 1; i >= 0; i--)
            {
                Property property = await propertyRepository.GetByIDAsync(articleTypeProperties[i].PropertyID);
                propertyList.Add(property);

                CertificateProperty? certificateProperty = await certificatePropertyRepository.GetCertificatePropertyByIDs(certificate.ID, property.ID);
                if (certificateProperty?.ID != 0)
                {
                    certificatePropertiesList.Add(certificateProperty);
                }

                if (property.FieldType == 3)
                {
                    List<PropertyChoise> propertyChoises = await propertyChoiseRepository.GetPropertyChoisesByPropertyID(property);
                    propertyChoisesList.AddRange(propertyChoises);
                }

            }

            //Converting Domain to Dto
            List<PropertyDto> propertyListDto = mapper.Map<List<PropertyDto>>(propertyList);
            List<ArticleTypePropertyDto> articleTypePropertyListDto = mapper.Map<List<ArticleTypePropertyDto>>(articleTypePropertyList);
            List<PropertyChoiseDto> propertyChoiseListDto = mapper.Map<List<PropertyChoiseDto>>(propertyChoisesList);
            List<CertificatePropertyDto> certificatePropertyListDto = mapper.Map<List<CertificatePropertyDto>>(certificateProperties);

            return Ok(new { propertyListDto, articleTypePropertyListDto, propertyChoiseListDto, certificatePropertyListDto });
        }


        [HttpGet]
        [Route("GetCertificatePropertyByIDs")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetCertificatePropertyByIDs([FromBody] int certificateID, int propertyID)
        {
            //Getting data
            CertificateProperty? certificatePropertyDomainModel = await certificatePropertyRepository.GetCertificatePropertyByIDs(certificateID, propertyID);

            //Converting Domain to Dto
            return Ok(mapper.Map<CertificatePropertyDto>(certificatePropertyDomainModel));
        }
    }
}
