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
    public class SupplierController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly ISupplierRepository supplierRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public SupplierController(IMapper mapper, ISupplierRepository supplierRepository)
        {
            this.mapper = mapper;
            this.supplierRepository = supplierRepository;
        }

        /// <summary>
        /// Searches for all the Suppliers inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Supplier/
        /// </summary>
        /// <returns>An OK 200 with all the Suppliers found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.SupplierRead))]
        public async Task<IActionResult> GetAllSuppliersAsync()
        {
            Logger.Info("Grabbing all Suppliers from the Database");

            //Getting data 
            List<Supplier> supplierDomainModel = await supplierRepository.GetAllAsync();

            Logger.Info("Found Suppliers: {}", JsonSerializer.Serialize(supplierDomainModel));

            //converting Domain to Dto
            return Ok(mapper.Map<List<SupplierDto>>(supplierDomainModel));
        }

        /// <summary>
        /// Search for a specific Supplier in the database, this endpoint is accesible through:<br/>
        /// GET: api/Supplier/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Supplier it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.SupplierRead))]
        public async Task<IActionResult> GetSupplierByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for Supplier: {}", ID);
            //Getting data
            Supplier? supplierDomainModel = await supplierRepository.GetByIDAsync(ID);

            //Checking if the role has value 
            if (supplierDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Supplier: {}", JsonSerializer.Serialize(supplierDomainModel));

            //Converting Domain to Dto
            return Ok(mapper.Map<SupplierDto>(supplierDomainModel));
        }

        /// <summary>
        /// Creates a new Supplier in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Supplier
        /// </summary>
        /// <remarks>
        /// The data used to create the Supplier is located in the Body of the request
        /// </remarks>
        /// <param name="addSupplierRequestDto">Info with which to create a new Supplier in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetSupplierByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.SupplierWrite))]
        public async Task<IActionResult> CreateSupplierAsync([FromBody] SupplierDto addSupplierRequestDto)
        {

            Logger.Info("Attempting to add {} to the database", addSupplierRequestDto.Name);

            //Convert Dto to domain
            Supplier? supplierDomainModel = mapper.Map<Supplier>(addSupplierRequestDto);

            //Create role
            supplierDomainModel = await supplierRepository.CreateAsync(supplierDomainModel);

            Logger.Info("Supplier added: {}", JsonSerializer.Serialize(supplierDomainModel));

            //Map Domain to Dto
            SupplierDto roleDto = mapper.Map<SupplierDto>(supplierDomainModel);
            return CreatedAtAction(nameof(GetSupplierByIDAsync), new { id = roleDto.ID }, roleDto);
        }

        /// <summary>
        /// Updates the Supplier that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Supplier/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Supplier is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Supplier you want to update</param>
        /// <param name="updateSupplierRequestDto">The updated information for the Supplier</param>
        /// <returns>A OK 200 with the Updated Supplier</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.SupplierWrite))]
        public async Task<IActionResult> UpdateSupplierByIDAsync([FromRoute] int ID, [FromBody] SupplierDto updateSupplierRequestDto)
        {

            Logger.Info("Attempting to update {}", updateSupplierRequestDto.Name);

            //Convert Dto to Domain
            Supplier? supplierDomainModel = mapper.Map<Supplier>(updateSupplierRequestDto);
            if (supplierDomainModel == null)
            {
                return NotFound();
            }
            //Update 
            supplierDomainModel = await supplierRepository.UpdateAsync(ID, supplierDomainModel);

            Logger.Info("Updated Supplier with: {}", JsonSerializer.Serialize(supplierDomainModel));

            //convert Domain to Dto
            SupplierDto roleDto = mapper.Map<SupplierDto>(supplierDomainModel);
            return Ok(roleDto);
        }

        /// <summary>
        /// Delete the Supplier that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Supplier/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Supplier you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Supplier</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.SupplierWrite))]
        public async Task<IActionResult> DeleteSupplierByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Supplier with ID: {}", ID);

            //Deleting Supplier
            Supplier? supplierDomainModel = await supplierRepository.DeleteAsync(ID);
            if (supplierDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Supplier: {}", JsonSerializer.Serialize(supplierDomainModel));

            return Ok(mapper.Map<SupplierDto>(supplierDomainModel));
        }



    }
}
