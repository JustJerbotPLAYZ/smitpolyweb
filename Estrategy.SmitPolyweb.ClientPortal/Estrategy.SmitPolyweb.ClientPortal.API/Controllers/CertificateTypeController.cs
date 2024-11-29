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
    public class CertificateTypeController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ICertificateTypeRepository certificateTypeRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public CertificateTypeController(IMapper mapper, ICertificateTypeRepository certificateTypeRepository)
        {
            this.mapper = mapper;
            this.certificateTypeRepository = certificateTypeRepository;
        }

        /// <summary>
        /// Searches for all the CertificateTypes inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateType/
        /// </summary>
        /// <returns>An OK 200 with all the CertificateTypes found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetAllCertificateTypesAsync()
        {
            Logger.Info("Grabbing all CertificateTypes from the Database");

            //Getting data 
            List<CertificateType> certificateTypeDomainModel = await certificateTypeRepository.GetAllAsync();

            Logger.Info("Obtained {0} CertificatesType", certificateTypeDomainModel.Count);

            //converting Domain to Dto
            return Ok(mapper.Map<List<CertificateTypeDto>>(certificateTypeDomainModel));
        }

        /// <summary>
        /// Search for a specific CertificateType in the database, this endpoint is accesible through:<br/>
        /// GET: api/CertificateType/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the CertificateType it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateRead))]
        public async Task<IActionResult> GetCertificateTypeByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for CertificateType: {}", ID);
            //Getting data
            CertificateType? certificateTypeDomainModel = await certificateTypeRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (certificateTypeDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found CertificateType: {}", JsonSerializer.Serialize(certificateTypeDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<CertificateTypeDto>(certificateTypeDomainModel));
        }

        /// <summary>
        /// Creates a new CertificateType in the Database, this endpoint is accesible through:<br/>
        /// POST: api/CertificateType
        /// </summary>
        /// <remarks>
        /// The data used to create the CertificateType is located in the Body of the request
        /// </remarks>
        /// <param name="addCertificateTypeRequestDto">Info with which to create a new CertificateType in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetCertificateTypeByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> CreateCertificateTypeAsync([FromBody] CertificateTypeDto addCertificateTypeRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addCertificateTypeRequestDto.Name);

            //Convert Dto to domain
            CertificateType? certificateTypeDomainModel = mapper.Map<CertificateType>(addCertificateTypeRequestDto);

            //Create role
            certificateTypeDomainModel = await certificateTypeRepository.CreateAsync(certificateTypeDomainModel);

            Logger.Info("CertificateType added: {}", JsonSerializer.Serialize(certificateTypeDomainModel));

            //Map Domain to Dto
            CertificateTypeDto roleDto = mapper.Map<CertificateTypeDto>(certificateTypeDomainModel);
            return CreatedAtAction(nameof(GetCertificateTypeByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the CertificateType that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/CertificateType/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the CertificateType is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the CertificateType you want to update</param>
        /// <param name="updateCertificateTypeRequestDto">The updated information for the CertificateType</param>
        /// <returns>A OK 200 with the Updated CertificateType</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> UpdateCertificateTypeByIDAsync([FromRoute] int ID, [FromBody] CertificateTypeDto updateCertificateTypeRequestDto)
        {

            Logger.Info("Attempting to update {}", updateCertificateTypeRequestDto.Name);

            //Convert Dto to Domain
            CertificateType? certificateTypeDomainModel = mapper.Map<CertificateType>(updateCertificateTypeRequestDto);
            if (certificateTypeDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            certificateTypeDomainModel = await certificateTypeRepository.UpdateAsync(ID, certificateTypeDomainModel);

            Logger.Info("Updated CertificateType with: {}", JsonSerializer.Serialize(certificateTypeDomainModel));

            //convert Domain to Dto
            CertificateTypeDto roleDto = mapper.Map<CertificateTypeDto>(certificateTypeDomainModel);
            return Ok(roleDto);
        }

        /// <summary>
        /// Delete the CertificateType that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/CertificateType/{ID}
        /// </summary>
        /// <param name="ID">The ID of the CertificateType you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted CertificateType</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CertificateWrite))]
        public async Task<IActionResult> DeleteCertificateTypeByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting CertificateType with ID: {}", ID);

            //Deleting CertificateType
            CertificateType? certificateTypeDomainModel = await certificateTypeRepository.DeleteAsync(ID);
            if (certificateTypeDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted CertificateType: {}", JsonSerializer.Serialize(certificateTypeDomainModel));

            return Ok(mapper.Map<CertificateTypeDto>(certificateTypeDomainModel));
        }

    }

}

