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
    public class ChecklistFieldController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IChecklistFieldRepository checklistFieldRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public ChecklistFieldController(IMapper mapper, IChecklistFieldRepository checklistFieldRepository)
        {
            this.mapper = mapper;
            this.checklistFieldRepository = checklistFieldRepository;

        }

        /// <summary>
        /// Searches for all the ChecklistFields inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/ChecklistField/
        /// </summary>
        /// <returns>An OK 200 with all the ChecklistFields found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.ChecklistRead))]
        public async Task<IActionResult> GetAllChecklistFieldsAsync()
        {
            Logger.Info("Grabbing all ChecklistFields from the Database");

            //Getting data 
            List<ChecklistField> checklistFieldDomainModel = await checklistFieldRepository.GetAllAsync();

            Logger.Info("Found ChecklistFields: {}", JsonSerializer.Serialize(checklistFieldDomainModel));

            //converting Domain to Dto
            return Ok(mapper.Map<List<ChecklistFieldDto>>(checklistFieldDomainModel));
        }

        /// <summary>
        /// Search for a specific ChecklistField in the database, this endpoint is accesible through:<br/>
        /// GET: api/ChecklistField/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the ChecklistField it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ChecklistRead))]
        public async Task<IActionResult> GetChecklistFieldByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for article: {}", ID);
            //Getting data
            ChecklistField? checklistFieldDomainModel = await checklistFieldRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (checklistFieldDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found ChecklistField: {}", JsonSerializer.Serialize(checklistFieldDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<ChecklistFieldDto>(checklistFieldDomainModel));
        }

        /// <summary>
        /// Creates a new ChecklistField in the Database, this endpoint is accesible through:<br/>
        /// POST: api/ChecklistField
        /// </summary>
        /// <remarks>
        /// The data used to create the ChecklistField is located in the Body of the request
        /// </remarks>
        /// <param name="addChecklistFieldRequestDto">Info with which to create a new ChecklistField in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetChecklistFieldByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> CreateChecklistFieldAsync([FromBody] ChecklistFieldDto addChecklistFieldRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addChecklistFieldRequestDto.Name);

            //Convert Dto to domain
            ChecklistField? checklistFieldDomainModel = mapper.Map<ChecklistField>(addChecklistFieldRequestDto);

            //Create role
            checklistFieldDomainModel = await checklistFieldRepository.CreateAsync(checklistFieldDomainModel);

            Logger.Info("ChecklistField added: {}", JsonSerializer.Serialize(checklistFieldDomainModel));

            //Map Domain to Dto
            ChecklistFieldDto roleDto = mapper.Map<ChecklistFieldDto>(checklistFieldDomainModel);
            return CreatedAtAction(nameof(GetChecklistFieldByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the ChecklistField that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/ChecklistField/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the ChecklistField is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the ChecklistField you want to update</param>
        /// <param name="updateChecklistFieldRequestDto">The updated information for the ChecklistField</param>
        /// <returns>A OK 200 with the Updated ChecklistField</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> UpdateChecklistFieldByIDAsync([FromRoute] int ID, [FromBody] ChecklistFieldDto updateChecklistFieldRequestDto)
        {

            Logger.Info("Attempting to update {}", updateChecklistFieldRequestDto.Name);

            //Convert Dto to Domain
            ChecklistField? checklistFieldDomainModel = mapper.Map<ChecklistField>(updateChecklistFieldRequestDto);
            if (checklistFieldDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            checklistFieldDomainModel = await checklistFieldRepository.UpdateAsync(ID, checklistFieldDomainModel);

            Logger.Info("Updated ChecklistField with: {}", JsonSerializer.Serialize(checklistFieldDomainModel));

            //convert Domain to Dto and return it
            return Ok(mapper.Map<ChecklistFieldDto>(checklistFieldDomainModel));
        }

        /// <summary>
        /// Delete the ChecklistField that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/ChecklistField/{ID}
        /// </summary>
        /// <param name="ID">The ID of the ChecklistField you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted ChecklistField</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> DeleteChecklistFieldByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting ChecklistField with ID: {}", ID);

            //Deleting ChecklistField
            ChecklistField? checklistFieldDomainModel = await checklistFieldRepository.DeleteAsync(ID);
            if (checklistFieldDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted ChecklistField: {}", JsonSerializer.Serialize(checklistFieldDomainModel));

            return Ok(mapper.Map<ChecklistFieldDto>(checklistFieldDomainModel));
        }
    }
}
