using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyChoiseController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IPropertyChoiseRepository propertyChoiseRepository;
        private readonly IPropertyRepository propertyRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public PropertyChoiseController(IMapper mapper, IPropertyChoiseRepository propertyChoiseRepository, IPropertyRepository propertyRepository)
        {
            this.mapper = mapper;
            this.propertyChoiseRepository = propertyChoiseRepository;
            this.propertyRepository = propertyRepository;
        }

        /// <summary>
        /// Searches for all the PropertyChoises inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/PropertyChoise/
        /// </summary>
        /// <returns>An OK 200 with all the PropertyChoises found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetAllPropertyChoisesAsync()
        {
            Logger.Info("Grabbing all PropertyChoises from the Database");

            //Getting data 
            List<PropertyChoise> propertyChoiseDomainModel = await propertyChoiseRepository.GetAllAsync();

            Logger.Info("Found PropertyChoises: {}", JsonSerializer.Serialize(propertyChoiseDomainModel));

            //converting Domain to Dto
            return Ok(mapper.Map<List<PropertyChoiseDto>>(propertyChoiseDomainModel));
        }

        /// <summary>
        /// Search for a specific PropertyChoise in the database, this endpoint is accesible through:<br/>
        /// GET: api/PropertyChoise/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the PropertyChoise it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetPropertyChoiseByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for PropertyChoise: {}", ID);
            //Getting data
            PropertyChoise? propertyChoiseDomainModel = await propertyChoiseRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (propertyChoiseDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found PropertyChoise: {}", JsonSerializer.Serialize(propertyChoiseDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<PropertyChoiseDto>(propertyChoiseDomainModel));
        }

        /// <summary>
        /// Creates a new PropertyChoise in the Database, this endpoint is accesible through:<br/>
        /// POST: api/PropertyChoise/
        /// </summary>
        /// <remarks>
        /// The data used to create the PropertyChoise is located in the Body of the request
        /// </remarks>
        /// <param name="addPropertyChoiseRequestDto">Info with which to create a new PropertyChoise in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetPropertyChoiseByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> CreatePropertyChoiseAsync([FromBody] PropertyChoiseDto addPropertyChoiseRequestDto)
        {


            //Convert Dto to domain
            PropertyChoise? propertyChoiseDomainModel = mapper.Map<PropertyChoise>(addPropertyChoiseRequestDto);

            //Create role
            propertyChoiseDomainModel = await propertyChoiseRepository.CreateAsync(propertyChoiseDomainModel);

            Logger.Info("PropertyChoise added: {}", JsonSerializer.Serialize(propertyChoiseDomainModel));

            //Map Domain to Dto
            PropertyChoiseDto roleDto = mapper.Map<PropertyChoiseDto>(propertyChoiseDomainModel);
            return CreatedAtAction(nameof(GetPropertyChoiseByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the PropertyChoise that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/PropertyChoise/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the PropertyChoise is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the PropertyChoise you want to update</param>
        /// <param name="updatePropertyChoiseRequestDto">The updated information for the PropertyChoise</param>
        /// <returns>A OK 200 with the Updated PropertyChoise</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> UpdatePropertyChoiseByIDAsync([FromRoute] int ID, [FromBody] PropertyChoiseDto updatePropertyChoiseRequestDto)
        {


            //Convert Dto to Domain
            PropertyChoise? propertyChoiseDomainModel = mapper.Map<PropertyChoise>(updatePropertyChoiseRequestDto);
            if (propertyChoiseDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            propertyChoiseDomainModel = await propertyChoiseRepository.UpdateAsync(ID, propertyChoiseDomainModel);

            Logger.Info("Updated PropertyChoise with: {}", JsonSerializer.Serialize(propertyChoiseDomainModel));

            //convert Domain to Dto and return it
            return Ok(mapper.Map<PropertyChoiseDto>(propertyChoiseDomainModel));
        }

        /// <summary>
        /// Delete the PropertyChoise that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/PropertyChoise/{ID}
        /// </summary>
        /// <param name="ID">The ID of the PropertyChoise you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted PropertyChoise</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyWrite))]
        public async Task<IActionResult> DeletePropertyChoiseByIDAsync([FromRoute] int ID)
        {

            //Deleting PropertyChoise
            PropertyChoise? propertyChoiseDomainModel = await propertyChoiseRepository.DeleteAsync(ID);
            if (propertyChoiseDomainModel == null)
            {
                return NotFound();
            }


            return Ok(mapper.Map<PropertyChoiseDto>(propertyChoiseDomainModel));
        }

        [HttpGet]
        [Route("GetPropertyChoisesByPropertyID/{ID:int}")]
        [Authorize(Roles = nameof(Permission.PropertyRead))]
        public async Task<IActionResult> GetPropertyChoisesByPropertyID([FromRoute] int ID)
        {
            //Getting data
            Property? property = await propertyRepository.GetByIDAsync(ID);
            List<PropertyChoise?> propertyChoiseDomainModel = await propertyChoiseRepository.GetPropertyChoisesByPropertyID(property);

            //Checking if the role has value 
            if (propertyChoiseDomainModel == null)
            {
                return NotFound();
            }

            //Converting Domain to Dto
            return Ok(mapper.Map<List<PropertyChoiseDto>>(propertyChoiseDomainModel));
        }

    }
}
