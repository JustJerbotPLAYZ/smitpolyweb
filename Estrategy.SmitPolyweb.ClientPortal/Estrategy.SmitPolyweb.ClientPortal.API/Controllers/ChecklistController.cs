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
    public class ChecklistController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IChecklistRepository checklistRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public ChecklistController(IMapper mapper, IChecklistRepository checklistRepository)
        {
            this.mapper = mapper;
            this.checklistRepository = checklistRepository;
        }

        /// <summary>
        /// Searches for all the Checklists inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Checklist/
        /// </summary>
        /// <returns>An OK 200 with all the Checklists found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.ChecklistRead))]
        public async Task<IActionResult> GetAllChecklistsAsync()
        {
            Logger.Info("Grabbing all Checklists from the Database");

            //Getting data 
            List<Checklist> checklistDomainModel = await checklistRepository.GetAllAsync();

            Logger.Info("Found Checklists: {}", JsonSerializer.Serialize(checklistDomainModel));

            //converting Domain to Dto
            return Ok(mapper.Map<List<ChecklistDto>>(checklistDomainModel));
        }

        /// <summary>
        /// Search for a specific Checklist in the database, this endpoint is accesible through:<br/>
        /// GET: api/Checklist/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Checklist it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ChecklistRead))]
        public async Task<IActionResult> GetChecklistByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for Checklist: {}", ID);
            //Getting data
            Checklist? checklistDomainModel = await checklistRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (checklistDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Checklist: {}", JsonSerializer.Serialize(checklistDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<ChecklistDto>(checklistDomainModel));
        }

        /// <summary>
        /// Creates a new Checklist in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Checklist/
        /// </summary>
        /// <remarks>
        /// The data used to create the Checklist is located in the Body of the request
        /// </remarks>
        /// <param name="addChecklistRequestDto">Info with which to create a new Checklist in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetChecklistByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> CreateChecklistAsync([FromBody] ChecklistDto addChecklistRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addChecklistRequestDto.Name);

            //Convert Dto to domain
            Checklist? checklistDomainModel = mapper.Map<Checklist>(addChecklistRequestDto);

            //Create role
            checklistDomainModel = await checklistRepository.CreateAsync(checklistDomainModel);

            Logger.Info("Checklist added: {}", JsonSerializer.Serialize(checklistDomainModel));

            //Map Domain to Dto
            ChecklistDto roleDto = mapper.Map<ChecklistDto>(checklistDomainModel);
            return CreatedAtAction(nameof(GetChecklistByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the Checklist that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Checklist/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Checklist is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Checklist you want to update</param>
        /// <param name="updateChecklistRequestDto">The updated information for the Checklist</param>
        /// <returns>A OK 200 with the Updated Checklist</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> UpdateChecklistByIDAsync([FromRoute] int ID, [FromBody] ChecklistDto updateChecklistRequestDto)
        {

            Logger.Info("Attempting to update {}", updateChecklistRequestDto.Name);

            //Convert Dto to Domain
            Checklist? checklistDomainModel = mapper.Map<Checklist>(updateChecklistRequestDto);
            if (checklistDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            checklistDomainModel = await checklistRepository.UpdateAsync(ID, checklistDomainModel);

            Logger.Info("Updated Checklist with: {}", JsonSerializer.Serialize(checklistDomainModel));

            //convert Domain to Dto and return it
            return Ok(mapper.Map<ChecklistDto>(checklistDomainModel));
        }

        /// <summary>
        /// Delete the Checklist that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Checklist/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Checklist you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Checklist</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.ChecklistWrite))]
        public async Task<IActionResult> DeleteChecklistByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Checklist with ID: {}", ID);

            //Deleting Checklist
            Checklist? checklistDomainModel = await checklistRepository.DeleteAsync(ID);
            if (checklistDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Checklist: {}", JsonSerializer.Serialize(checklistDomainModel));

            return Ok(mapper.Map<ChecklistDto>(checklistDomainModel));
        }

    }
}
