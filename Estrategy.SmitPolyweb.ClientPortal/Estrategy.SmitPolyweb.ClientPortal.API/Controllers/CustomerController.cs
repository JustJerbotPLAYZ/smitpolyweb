using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Extentions;
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
    public class CustomerController : ControllerBase
    {

        private readonly IMapper mapper;
        private readonly ICustomerRepository customerRepository;
        private readonly IUserRepository userRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public CustomerController(IMapper mapper, ICustomerRepository customerRepository, IUserRepository userRepository)
        {
            this.mapper = mapper;
            this.customerRepository = customerRepository;
            this.userRepository = userRepository;
        }

        /// <summary>
        /// Searches for all the Customers inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Customer/
        /// </summary>
        /// <returns>An OK 200 with all the Customers found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.CustomerRead))]
        public async Task<IActionResult> GetAllCustomersAsync()
        {
            var roleName = User.Identity.GetName().ToLower();
            List<Customer> customerDomainModel = await customerRepository.GetAllAsync();

            switch (roleName)
            {
                case "customer":
                case "customerread":
                    int customerID = Int32.Parse(User.Identity.GetCustomerID());
                    Customer customer = await customerRepository.GetByIDAsync(customerID);
                    customerDomainModel = [];
                    customerDomainModel.Add(customer);
                    break;
            }


            return Ok(mapper.Map<List<CustomerDto>>(customerDomainModel));
        }

        [HttpPost]
        [Route("FilteredCustomers")]
        [Authorize(Roles = nameof(Permission.CustomerRead))]
        public async Task<IActionResult> GetAllFilteredCustomers([FromBody] CustomerFilterDto customerDto)
        {
            List<Customer> customerDomailModel = await customerRepository.GetAllFilteredAsync(customerDto);

            return Ok(mapper.Map<List<CustomerDto>>(customerDomailModel));
        }

        /// <summary>
        /// Search for a specific Customer in the database, this endpoint is accesible through:<br/>
        /// GET: api/Customer/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Customer it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CustomerRead))]
        public async Task<IActionResult> GetCustomerByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for Customer: {}", ID);

            Customer? customerDomainModel = await customerRepository.GetByIDAsync(ID);

            if (customerDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Customer: {}", JsonSerializer.Serialize(customerDomainModel));

            return Ok(mapper.Map<CustomerDto>(customerDomainModel));
        }

        /// <summary>
        /// Creates a new Customer in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Customer
        /// </summary>
        /// <remarks>
        /// The data used to create the Customer is located in the Body of the request
        /// </remarks>
        /// <param name="addCustomerRequestDto">Info with which to create a new Customer in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ActionName(nameof(GetCustomerByIDAsync))]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CustomerWrite))]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CustomerDto addCustomerRequestDto)
        {
            Logger.Info("Attempting to add {} to the database", addCustomerRequestDto.CustomerName);

            Customer? customerDomainModel = mapper.Map<Customer>(addCustomerRequestDto);

            customerDomainModel = await customerRepository.CreateAsync(customerDomainModel);

            Logger.Info("Customer added: {}", JsonSerializer.Serialize(customerDomainModel));

            CustomerDto customerDto = mapper.Map<CustomerDto>(customerDomainModel);
            return CreatedAtAction(nameof(GetCustomerByIDAsync), new { id = customerDto.ID }, customerDto);
        }

        /// <summary>
        /// Updates the Customer that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Customer/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Customer is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Customer you want to update</param>
        /// <param name="updateCustomerRequestDto">The updated information for the Customer</param>
        /// <returns>A OK 200 with the Updated Customer</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.CustomerWrite))]
        public async Task<IActionResult> UpdateCustomerByIDAsync([FromRoute] int ID, [FromBody] CustomerDto updateCustomerRequestDto)
        {

            Logger.Info("Attempting to update {}", updateCustomerRequestDto.CustomerName);

            Customer? customerDomainModel = mapper.Map<Customer>(updateCustomerRequestDto);
            if (customerDomainModel == null)
            {
                return NotFound();
            }

            customerDomainModel = await customerRepository.UpdateAsync(ID, customerDomainModel);

            Logger.Info("Updated Customer with: {}", JsonSerializer.Serialize(customerDomainModel));

            return Ok(mapper.Map<CustomerDto>(customerDomainModel));
        }

        /// <summary>
        /// Delete the Customer that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Customer/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Customer you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Customer</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.CustomerWrite))]
        public async Task<IActionResult> DeleteCustomerByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Customer with ID: {}", ID);

            Customer? customerDomainModel = await customerRepository.DeleteAsync(ID);
            if (customerDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Customer: {}", JsonSerializer.Serialize(customerDomainModel));

            return Ok(mapper.Map<CustomerDto>(customerDomainModel));
        }

        [HttpGet]
        [Route("User/GetByIDs/{ID:int}")]
        [Authorize(Roles = nameof(Permission.UserRead))]

        public async Task<IActionResult> GetAllUsersByCustomerID([FromRoute] int ID)
        {
            List<User> userList = await customerRepository.GetAllUsersByCustomerID(ID);

            return Ok(mapper.Map<List<User?>>(userList));
        }


        [HttpGet]
        [Route("GetAllCustomersWithAddress")]
        [Authorize(Roles = nameof(Permission.CustomerRead))]
        public async Task<IActionResult> GetAllCustomersWithAddress()
        {

            List<Customer> customerDomainModel = await customerRepository.GetAllAsync();

            return Ok(mapper.Map<List<CustomerDto>>(customerDomainModel));
        }

    }
}

