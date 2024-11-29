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
    public class AddressController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IAddressRepository AddressRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();


        public AddressController(IMapper Mapper, IAddressRepository AddressRepository, ITokenRepository TokenRepository)
        {
            this.Mapper = Mapper;
            this.AddressRepository = AddressRepository;
        }

        /// <summary>
        /// Searches for all the Addresses inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Address/
        /// </summary>
        /// <returns>An OK 200 with all the addresses found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.AddressRead))]
        public async Task<IActionResult> GetAllAsync()
        {

            Logger.Info("Grabbing all Addresses from the Database");

            //Getting data 
            List<Address> addressDomainModel = await AddressRepository.GetAllAsync();

            Logger.Info("Found Addresses: {}", JsonSerializer.Serialize(addressDomainModel));

            //converting Domain to Dto
            return Ok(Mapper.Map<List<AddressDto>>(addressDomainModel));
        }


        /// <summary>
        /// Search for a specific Address in the database, this endpoint is accesible through:<br/>
        /// GET: api/Address/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Address it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.AddressRead))]
        public async Task<IActionResult> GetByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for address: {}", ID);
            // Search for the data in the Database
            Address? addressDomainModel = await AddressRepository.GetByIDAsync(ID);

            //Checking if the address has value 
            if (addressDomainModel == null)
            {
                Logger.Info("Could not locate: {}", ID);
                return NotFound();
            }

            Logger.Info("Found Address: {}", JsonSerializer.Serialize(addressDomainModel));
            //Converting Domain to Dto
            return Ok(Mapper.Map<AddressDto>(addressDomainModel));

        }

        /// <summary>
        /// Creates a new Address in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Address
        /// </summary>
        /// <remarks>
        /// The data used to create the Address is located in the Body of the request
        /// </remarks>
        /// <param name="addAddressRequestDto">Info with which to create a new Address in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.AddressWrite))]
        public async Task<IActionResult> CreateAsync([FromBody] AddressDto addAddressRequestDto)
        {
            Logger.Info("Attempting to add {0} {1} to the database", addAddressRequestDto.StreetName, addAddressRequestDto.HouseNumber);

            //Convert Dto to domain
            Address? addressDomainModel = Mapper.Map<Address>(addAddressRequestDto);

            //Create address
            addressDomainModel = await AddressRepository.CreateAsync(addressDomainModel);

            Logger.Info("Address added: {}", JsonSerializer.Serialize(addressDomainModel));
            //Map Domain to Dto
            AddressDto addressDto = Mapper.Map<AddressDto>(addressDomainModel);
            return CreatedAtAction(nameof(GetByIDAsync), addressDto);
        }


        /// <summary>
        /// Updates the Address that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Address/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Address is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Address you want to update</param>
        /// <param name="updateAddressRequestDto">The updated information for the Address</param>
        /// <returns>A OK 200 with the Updated Address</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.AddressWrite))]
        public async Task<IActionResult> UpdateAsync([FromRoute] int ID, [FromBody] AddressDto updateAddressRequestDto)
        {

            Logger.Info("Attempting to update {0} {1}", updateAddressRequestDto.StreetName, updateAddressRequestDto.HouseNumber);

            //Convert Dto to Domain
            Address? addressDomainModel = Mapper.Map<Address>(updateAddressRequestDto);

            if (addressDomainModel == null)
            {
                return BadRequest();
            }

            //Update 
            addressDomainModel = await AddressRepository.UpdateAsync(ID, addressDomainModel);

            Logger.Info("Updated Address with: {}", JsonSerializer.Serialize(addressDomainModel));

            //convert Domain to Dto and return it
            return Ok(Mapper.Map<AddressDto>(addressDomainModel));
        }

        /// <summary>
        /// Delete the Address that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Address/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Address you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Address</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.AddressWrite))]
        public async Task<IActionResult> DeleteAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Address with ID: {}", ID);

            //Deleting Address
            Address? addressDomainModel = await AddressRepository.DeleteAsync(ID);
            if (addressDomainModel == null)
            {
                return NotFound();
            }
            Logger.Info("Deleted Address: {}", JsonSerializer.Serialize(addressDomainModel));
            return Ok(Mapper.Map<AddressDto>(addressDomainModel));
        }
    }
}
