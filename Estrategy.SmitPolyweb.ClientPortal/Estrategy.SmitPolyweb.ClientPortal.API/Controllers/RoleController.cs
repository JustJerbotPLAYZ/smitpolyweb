using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Extentions;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IRoleRepository roleRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();


        public RoleController(IMapper mapper, IRoleRepository roleRepository)
        {
            this.mapper = mapper;
            this.roleRepository = roleRepository;

        }

        /// <summary>
        /// Searches for all the Roles inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/Role/
        /// </summary>
        /// <returns>An OK 200 with all the Roles found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.RoleRead))]
        public async Task<IActionResult> GetAllAsync()
        {

            var roleName = User.Identity.GetName().ToLower();
            List<Role> roles = await roleRepository.GetAllAsync();

            switch (roleName)
            {
                case "mechanic":
                    List<Role> tempRole = roles.Where(role => role.Name.ToLower() == "admin").ToList();
                    roles.Remove(tempRole[0]);
                    break;

                case "customer":
                    roles = roles.Where(role => role.Name.ToLower() == "customer" || role.Name.ToLower() == "customerread").ToList();
                    break;

                case "customerread":
                    roles = [];
                    break;
            }
            return Ok(mapper.Map<List<RoleDto>>(roles));
        }

        /// <summary>
        /// Search for a specific Role in the database, this endpoint is accesible through:<br/>
        /// GET: api/Role/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the Role it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.RoleRead))]
        public async Task<IActionResult> GetByIDAsync([FromRoute] int ID)
        {
            Logger.Info("Searching for article: {}", ID);

            Role? roleDomainModel = await roleRepository.GetByIDAsync(ID);

            if (roleDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Found Role: {}", JsonSerializer.Serialize(roleDomainModel));

            return Ok(mapper.Map<RoleDto>(roleDomainModel));
        }

        /// <summary>
        /// Creates a new Role in the Database, this endpoint is accesible through:<br/>
        /// POST: api/Role
        /// </summary>
        /// <remarks>
        /// The data used to create the Role is located in the Body of the request
        /// </remarks>
        /// <param name="addRoleRequestDto">Info with which to create a new Role in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.RoleWrite))]
        public async Task<IActionResult> CreateAsync([FromBody] RoleDto addRoleRequestDto)
        {
            Logger.Info("Attempting to add {} to the database", addRoleRequestDto.Name);
            Role roleDomainModel = mapper.Map<Role>(addRoleRequestDto);
            List<Permission>? permissions = roleDomainModel.Permissions;

            if (permissions != null)
                foreach (Permission getAllInfo in permissions)
                {
                    if (!Enum.IsDefined(typeof(Permission), getAllInfo))
                    {
                        return BadRequest("Please enter existing value for Permissions");
                    }
                }
            roleDomainModel = await roleRepository.CreateAsync(roleDomainModel);


            Logger.Info("Role added: {}", JsonSerializer.Serialize(roleDomainModel));

            return Ok(mapper.Map<RoleDto>(roleDomainModel));
        }

        /// <summary>
        /// Updates the Role that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/Role/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the Role is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the Role you want to update</param>
        /// <param name="updateRoleRequestDto">The updated information for the Role</param>
        /// <returns>A OK 200 with the Updated Role</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.RoleWrite))]
        public async Task<IActionResult> UpdateAsync([FromRoute] int ID, [FromBody] RoleDto updateRoleRequestDto)
        {
            Logger.Info("Attempting to update {}", updateRoleRequestDto.Name);

            Role? roleDomainModel = mapper.Map<Role>(updateRoleRequestDto);
            if (roleDomainModel == null)
            {
                return BadRequest();
            }

            roleDomainModel = await roleRepository.UpdateAsync(ID, roleDomainModel);

            Logger.Info("Updated Role with: {}", JsonSerializer.Serialize(roleDomainModel));

            return Ok(mapper.Map<RoleDto>(roleDomainModel));
        }

        /// <summary>
        /// Delete the Role that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/Role/{ID}
        /// </summary>
        /// <param name="ID">The ID of the Role you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted Role</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.RoleWrite))]
        public async Task<IActionResult> DeleteAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting Role with ID: {}", ID);

            Role? roleDomainModel = await roleRepository.DeleteAsync(ID);
            if (roleDomainModel == null)
            {
                return NotFound();
            }

            Logger.Info("Deleted Role: {}", JsonSerializer.Serialize(roleDomainModel));

            return Ok(mapper.Map<RoleDto>(roleDomainModel));
        }
    }
}
