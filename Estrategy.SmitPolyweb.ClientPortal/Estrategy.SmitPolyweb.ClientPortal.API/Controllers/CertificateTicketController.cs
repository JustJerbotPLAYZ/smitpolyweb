using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Coupling;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;
using System.Runtime.InteropServices;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CertificateTicketController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ICertificateTicketRepository certificateTicketRepository;
        private readonly ICertificateRepository certificateRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public CertificateTicketController(IMapper mapper, ICertificateTicketRepository certificateTicketRepository, ICertificateRepository certificateRepository)
        {
            this.mapper = mapper;
            this.certificateTicketRepository = certificateTicketRepository;
            this.certificateRepository = certificateRepository;
        }

        /// <summary>
        /// Searches for all the CertificateTickets inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateTicket/
        /// </summary>
        /// <returns>An OK 200 with all the CertificateTickets found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetAllCertificateTicketsAsync()
        {
            Logger.Info("Grabbing all CertificateTickets from the Database");

            //Getting data 
            List<CertificateTicket> certificateTicketDomainModel = await certificateTicketRepository.GetAllAsync();

            Logger.Info("Found CertificateTickets: {}", JsonSerializer.Serialize(certificateTicketDomainModel));

            //converting Domain to Dto
            return Ok(mapper.Map<List<CertificateTicketDto>>(certificateTicketDomainModel));
        }

        /// <summary>
        /// Search for a specific CertificateTicket in the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateTicket/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the CertificateTicket it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetCertificateTicketByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for CertificateTicket: {}", ID);
            //Getting data
            CertificateTicket? certificateTicketDomainModel = await certificateTicketRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (certificateTicketDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found CertificateTicket: {}", JsonSerializer.Serialize(certificateTicketDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<CertificateTicketDto>(certificateTicketDomainModel));
        }

        /// <summary>
        /// Creates a new CertificateTicket in the Database, this endpoint is accesible through:<br/>
        /// POST: api/CertificateTicket
        /// </summary>
        /// <remarks>
        /// The data used to create the CertificateTicket is located in the Body of the request
        /// </remarks>
        /// <param name="addCertificateTicketRequestDto">Info with which to create a new CertificateTicket in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetCertificateTicketByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> CreateCertificateTicketAsync([FromBody] CertificateTicketDto addCertificateTicketRequestDto)
        {

            //Convert Dto to domain
            CertificateTicket? certificateTicketDomainModel = mapper.Map<CertificateTicket>(addCertificateTicketRequestDto);

            //Create role
            certificateTicketDomainModel = await certificateTicketRepository.CreateAsync(certificateTicketDomainModel);

            Logger.Info("CertificateTicket added: {}", JsonSerializer.Serialize(certificateTicketDomainModel));

            //Map Domain to Dto
            CertificateTicketDto roleDto = mapper.Map<CertificateTicketDto>(certificateTicketDomainModel);
            return CreatedAtAction(nameof(GetCertificateTicketByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the CertificateTicket that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/CertificateTicket/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the CertificateTicket is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the CertificateTicket you want to update</param>
        /// <param name="updateCertificateTicketRequestDto">The updated information for the CertificateTicket</param>
        /// <returns>A OK 200 with the Updated CertificateTicket</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> UpdateCertificateTicketByIDAsync([FromRoute] int ID, [FromBody] CertificateTicketDto updateCertificateTicketRequestDto)
        {

            //Convert Dto to Domain
            CertificateTicket? certificateTicketDomainModel = mapper.Map<CertificateTicket>(updateCertificateTicketRequestDto);
            if (certificateTicketDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            certificateTicketDomainModel = await certificateTicketRepository.UpdateAsync(ID, certificateTicketDomainModel);

            Logger.Info("Updated CertificateTicket with: {}", JsonSerializer.Serialize(certificateTicketDomainModel));

            //convert Domain to Dto
            CertificateTicketDto roleDto = mapper.Map<CertificateTicketDto>(certificateTicketDomainModel);
            return Ok(roleDto);
        }

        /// <summary>
        /// Delete the CertificateTicket that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/CertificateTicket/{ID}
        /// </summary>
        /// <param name="ID">The ID of the CertificateTicket you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted CertificateTicket</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> DeleteCertificateTicketByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting CertificateTicket with ID: {}", ID);

            //Deleting CertificateTicket
            CertificateTicket? certificateTicketDomainModel = await certificateTicketRepository.DeleteAsync(ID);
            if (certificateTicketDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted CertificateTicket: {}", JsonSerializer.Serialize(certificateTicketDomainModel));

            return Ok(mapper.Map<CertificateTicketDto>(certificateTicketDomainModel));
        }

        [HttpGet]
        [Route("GetCertificatesByTicketID/{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetCertificatesByTicketID([FromRoute] int ID)
        {
            //Getting data
            List<Certificate> certificates = new();
            List<CertificateTicket>? certificateTickets = await certificateTicketRepository.GetCertificatesByTicketID(ID);

            for (int i = certificateTickets.Count() - 1; i >= 0; i--)
            {
                Certificate? certificate = await certificateRepository.GetByIDAsync(certificateTickets[i].CertificateID);
                certificates.Add(certificate);
            }

            //Converting Domain to Dto
            return Ok(mapper.Map<List<CertificateDto>>(certificates));
        }


        [HttpPatch]
        [Route("UpdateCertificateTicketByIDs")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> UpdateCertificateTicketByIDs([FromBody] CertificateTicketUpdateDto CertificateTicketData)
        {

            //Convert Dto to Domain
            CertificateTicket certTicket = await certificateTicketRepository.GetCertificateTicketByIDs(CertificateTicketData.OldTicketID, CertificateTicketData.OldCertificateID);
            //Update 
            CertificateTicket newCertTicket = new();
            newCertTicket.CertificateID = CertificateTicketData.NewCertificateID;
            newCertTicket.TicketID = CertificateTicketData.NewTicketID;

            var certificateTicketDomainModel = await certificateTicketRepository.UpdateAsync(certTicket.ID, newCertTicket);

            //convert Domain to Dto
            CertificateTicketDto roleDto = mapper.Map<CertificateTicketDto>(certificateTicketDomainModel);
            return Ok(roleDto);
        }


    }
}
