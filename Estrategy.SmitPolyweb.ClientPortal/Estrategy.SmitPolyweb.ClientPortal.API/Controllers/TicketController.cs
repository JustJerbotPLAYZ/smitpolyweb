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
    public class TicketController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ITicketRepository ticketRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();


        public TicketController(IMapper mapper, ITicketRepository ticketRepository)
        {
            this.mapper = mapper;
            this.ticketRepository = ticketRepository;
        }

        /// <summary>
        /// Searches for all the Tickets inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Ticket/
        /// </summary>
        /// <returns>An OK 200 with all the Tickets found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.TicketRead))]
        public async Task<IActionResult> GetAllTicketsAsync()
        {
            Logger.Info("Grabbing all Tickets from the Database");

            //Getting data 
            List<Ticket> ticketDomainModel = await ticketRepository.GetAllAsync();

            //converting Domain to Dto
            return Ok(mapper.Map<List<TicketDto>>(ticketDomainModel));
        }

        /// <summary>
        /// Search for a specific Ticket in the database, this endpoint is accesible through:<br/>
        /// GET: api/Ticket/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Ticket it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.TicketRead))]
        public async Task<IActionResult> GetTicketByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for Ticket: {}", ID);
            //Getting data
            Ticket? ticketDomainModel = await ticketRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (ticketDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Ticket: {}", JsonSerializer.Serialize(ticketDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<TicketDto>(ticketDomainModel));
        }

        /// <summary>
        /// Creates a new Ticket in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Ticket
        /// </summary>
        /// <remarks>
        /// The data used to create the Ticket is located in the Body of the request
        /// </remarks>
        /// <param name="addTicketRequestDto">Info with which to create a new Ticket in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetTicketByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.TicketWrite))]
        public async Task<IActionResult> CreateTicketAsync([FromBody] TicketDto addTicketRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addTicketRequestDto.TicketNumber);

            //Convert Dto to domain
            Ticket? ticketDomainModel = mapper.Map<Ticket>(addTicketRequestDto);

            //Create role
            ticketDomainModel = await ticketRepository.CreateAsync(ticketDomainModel);

            Logger.Info("Ticket added: {}", JsonSerializer.Serialize(ticketDomainModel));

            //Map Domain to Dto
            TicketDto ticketDto = mapper.Map<TicketDto>(ticketDomainModel);
            return CreatedAtAction(nameof(GetTicketByIDAsync), new { id = ticketDto.ID }, ticketDto);
        }

        /// <summary>
        /// Updates the Ticket that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Ticket/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Ticket is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Ticket you want to update</param>
        /// <param name="updateTicketRequestDto">The updated information for the Ticket</param>
        /// <returns>A OK 200 with the Updated Ticket</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.TicketWrite))]
        public async Task<IActionResult> UpdateTicketByIDAsync([FromRoute] int ID, [FromBody] TicketDto updateTicketRequestDto)
        {

            Logger.Info("Attempting to update {}", updateTicketRequestDto.TicketNumber);

            //Convert Dto to Domain
            Ticket? ticketDomainModel = mapper.Map<Ticket>(updateTicketRequestDto);
            if (ticketDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            ticketDomainModel = await ticketRepository.UpdateAsync(ID, ticketDomainModel);

            Logger.Info("Updated Ticket with: {}", JsonSerializer.Serialize(ticketDomainModel));

            //convert Domain to Dto and return it
            return Ok(mapper.Map<TicketDto>(ticketDomainModel));
        }

        /// <summary>
        /// Delete the Ticket that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Ticket/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Ticket you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Ticket</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.TicketWrite))]
        public async Task<IActionResult> DeleteTicketByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Ticket with ID: {}", ID);

            //Deleting Ticket
            Ticket? ticketDomainModel = await ticketRepository.DeleteAsync(ID);
            if (ticketDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Ticket: {}", JsonSerializer.Serialize(ticketDomainModel));

            return Ok(mapper.Map<TicketDto>(ticketDomainModel));
        }

    }
}
