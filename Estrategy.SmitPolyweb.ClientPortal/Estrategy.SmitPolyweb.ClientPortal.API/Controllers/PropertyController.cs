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

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IPropertyRepository propertyRepository;
        private readonly IPropertyService propertyService;
        private readonly IArticleTypeRepository articleTypeRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public PropertyController(IMapper mapper, IPropertyRepository propertyRepository, IPropertyService propertyService, IArticleTypeRepository articleTypeRepository)
        {
            this.mapper = mapper;
            this.propertyRepository = propertyRepository;
            this.propertyService = propertyService;
            this.articleTypeRepository = articleTypeRepository;
        }

        /// <summary>
        /// Searches for all the Properties inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Property/
        /// </summary>
        /// <returns>An OK 200 with all the Properties found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAllPropertysAsync()
        {

            Logger.Info("Grabbing all Properties from the Database");

            List<Property> propertyDomainModel = await propertyRepository.GetAllAsync();

            Logger.Info("Found {} Properties", propertyDomainModel.Count);

            return Ok(mapper.Map<List<PropertyDto>>(propertyDomainModel));
        }

        /// <summary>
        /// Search for a specific Property in the database, this endpoint is accesible through:<br/>
        /// GET: api/Property/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Property it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetPropertyByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for article: {}", ID);

            Property? propertyDomainModel = await propertyService.GetPropertyWithArticleTypesByIDAsync(ID);

            if (propertyDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Property: {}", propertyDomainModel.Name);

            return Ok(mapper.Map<PropertyDto>(propertyDomainModel));
        }

        /// <summary>
        /// Creates a new Property in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Property
        /// </summary>
        /// <remarks>
        /// The data used to create the Property is located in the Body of the request
        /// </remarks>
        /// <param name="addPropertyRequestDto">Info with which to create a new Property in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetPropertyByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> CreatePropertyAsync([FromBody] PropertyDto addPropertyRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addPropertyRequestDto.Name);

            Property? propertyDomainModel = mapper.Map<Property>(addPropertyRequestDto);

            propertyDomainModel = await propertyRepository.CreateAsync(propertyDomainModel);

            Logger.Info("Property added: {}", propertyDomainModel.Name);

            PropertyDto propertyDto = mapper.Map<PropertyDto>(propertyDomainModel);
            return CreatedAtAction(nameof(GetPropertyByIDAsync), new { id = propertyDto.ID }, propertyDto);
        }

        /// <summary>
        /// Updates the Property that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Property/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Property is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Property you want to update</param>
        /// <param name="updatePropertyRequestDto">The updated information for the Property</param>
        /// <returns>A OK 200 with the Updated Property</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> UpdatePropertyByIDAsync([FromRoute] int ID, [FromBody] PropertyDto updatePropertyRequestDto)
        {

            Logger.Info("Attempting to update {}", updatePropertyRequestDto.Name);

            Property? propertyDomainModel = mapper.Map<Property>(updatePropertyRequestDto);
            if (propertyDomainModel == null)
                return NotFound();

            propertyDomainModel = await propertyService.UpdatePropertyAsync(ID, propertyDomainModel);
            if (propertyDomainModel == null)
                return NotFound();

            Logger.Info("Successfully updated {}", propertyDomainModel.Name);

            return Ok(mapper.Map<PropertyDto>(propertyDomainModel));
        }

        /// <summary>
        /// Delete the Property that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Property/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Property you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Property</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> DeletePropertyByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Property with ID: {}", ID);

            Property? propertyDomainModel = await propertyRepository.DeleteAsync(ID);
            if (propertyDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Property: {}", propertyDomainModel.Name);

            return Ok(mapper.Map<PropertyDto>(propertyDomainModel));
        }

        [HttpGet]
        [Route("GetArticleTypePropertyByPropertyID/{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetArticleTypePropertyByPropertyID([FromRoute] int ID)
        {
            Property? property = await propertyRepository.GetByIDAsync(ID);
            List<ArticleTypeProperty?> propertyDomainModel = await propertyService.GetArticleTypePropertyByPropertyID(property);
            if (propertyDomainModel == null)
            {
                return Ok();
            }
            return Ok(mapper.Map<List<ArticleTypePropertyDto>>(propertyDomainModel));
        }

        [HttpGet]
        [Route("AvailableProperties/{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAvailableProperties([FromRoute] int ID)
        {
            ArticleType? articleType = await articleTypeRepository.GetByIDAsync(ID);
            List<Property?> propertyDomainModel = await propertyService.GetAvailableProperties(articleType);

            return Ok(mapper.Map<List<PropertyDto>>(propertyDomainModel));
        }
    }
}
