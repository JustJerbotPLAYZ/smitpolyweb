using AutoMapper;
using Estrategy.SmitPolyweb.ClientPortal.API.CustomActionFilters;
using Estrategy.SmitPolyweb.ClientPortal.API.Extentions;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Enumerations;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Estrategy.SmitPolyweb.ClientPortal.API.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Text.Json;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserRepository userRepository, IMapper mapper, IRoleRepository roleRepository) : ControllerBase
    {
        private readonly IUserRepository userRepository = userRepository;
        private readonly IMapper mapper = mapper;
        private readonly IRoleRepository roleRepository = roleRepository;
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Searches for all the Users inside of the database, this endpoint is accesible through:<br/>
        /// GET: api/User/
        /// </summary>
        /// <returns>An OK 200 with all the Users found in the Database</returns>
        [HttpGet]
        [Authorize(Roles = nameof(Permission.UserRead))]
        public async Task<IActionResult> GetAllUsersAsync()
        {

            List<User> users = await userRepository.GetAllAsync();

            var roleName = User.Identity.GetName().ToLower();

            switch (roleName)
            {
                case "customer":
                    int customerID = Int32.Parse(User.Identity.GetCustomerID());
                    users = users.Where(user => user.CustomerID == customerID).ToList();
                    break;

                case "customerread":
                    users = [];
                    break;
            }
            foreach (User user in users)
            {
                user.Password = null;
            }

            return Ok(mapper.Map<List<UserDto>>(users));
        }

        /// <summary>
        /// Search for a specific User in the database, this endpoint is accesible through:<br/>
        /// GET: api/User/{ID}
        /// </summary>
        /// <param name="ID">The ID to search for in the Database</param>
        /// <returns>An OK 200 with the User it found, otherwis return a Not Found 404</returns>
        [HttpGet]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.UserRead))]
        public async Task<IActionResult> GetUserByIDAsync([FromRoute] int ID)
        {
            User? user = await userRepository.GetByIDAsync(ID);

            if (user == null)
                return NotFound();

            if (user.Password != null)
                user.Password = null;

            return Ok(mapper.Map<UserDto>(user));
        }

        /// <summary>
        /// Creates a new User in the Database, this endpoint is accesible through:<br/>
        /// POST: api/User
        /// </summary>
        /// <remarks>
        /// The data used to create the User is located in the Body of the request
        /// </remarks>
        /// <param name="toCreate">Info with which to create a new User in the Database</param>
        /// <returns>A Created At Action 201 with the newly created object</returns>
        [HttpPost]
        [ValidateModel]
        [ActionName(nameof(GetUserByIDAsync))]
        [Authorize(Roles = nameof(Permission.UserWrite))]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserDto toCreate)
        {
            //Logger.Info("Attempting to create {0} {1}", toCreate.FirstName, toCreate.LastName);
            User user = mapper.Map<User>(toCreate);
            var roleName = User.Identity.GetName().ToLower();
            if (user.Password == null || !PasswordHelper.ValidatePassword(user.Password))
                return BadRequest("Invalid password");

            Role? role = await roleRepository.GetByIDAsync(user.RoleID);

            if (roleName == "customer" || roleName == "customerread")
            {
                if (role.Name.ToLower() == "admin" || role.Name.ToLower() == "mechanic")
                {
                    return BadRequest();
                }
            }
            else if (roleName == "mechanic")
            {
                return BadRequest();
            }
            // Map the DTO to a user, then create this user in the database
            user = await userRepository.CreateAsync(user);

            //Logger.Info("User added: {}", JsonSerializer.Serialize(user));

            //Map the user back to a DTO so we can send it back
            UserDto userDTO = mapper.Map<UserDto>(user);
            return CreatedAtAction(nameof(GetUserByIDAsync), userDTO.ID, userDTO);
        }



        /// <summary>
        /// Updates the User that matches the given ID with the provided information, this endpoint is accesible through: <br/>
        /// PUT: /api/User/{ID}
        /// </summary>
        /// <remarks>
        /// The data used to update the User is located in the Body of the request
        /// </remarks>
        /// <param name="ID">The ID of the User you want to update</param>
        /// <param name="toUpdate">The updated information for the User</param>
        /// <returns>A OK 200 with the Updated User</returns>
        [HttpPatch]
        [Route("{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.UserWrite))]
        public async Task<IActionResult> UpdateUserAsync([FromRoute] int ID, [FromBody] UserDto toUpdate)
        {
            Logger.Info("Attempting to update {0} {1}", toUpdate.FirstName, toUpdate.LastName);
            User? user = mapper.Map<User>(toUpdate);
            User? databaseUser = await userRepository.GetUsersPasswordHistory(ID);

            if (user.PasswordHashType == PasswordHashType.NotSet)
            {
                if (!PasswordHelper.ValidatePassword(user.Password))
                    return BadRequest("Invalid password");
                // Note Hashing currently happens on saving, so we don't hash here!

                string hashedPassword = PasswordHelper.GenerateSaltedPassword(user.Password, databaseUser.CreationDate.ToString());

                if (PasswordHelper.PasswordPreviouslyUsed(databaseUser, hashedPassword))
                {
                    return BadRequest("Previously used password");
                }
            }
            else
            {
                user.PasswordHashType = PasswordHashType.Salted;
                user.Password = databaseUser.Password;
            }

            await userRepository.UpdateAsync(ID, user);
            if (user == null)
                return NotFound();
            Logger.Info("Updated User with: {}", JsonSerializer.Serialize(user));
            return Ok(mapper.Map<UserDto>(user));
        }

        /// <summary>
        /// Delete the User that matches with the given ID, this endpoint is accesible through:<br/>
        /// DELETE: api/User/{ID}
        /// </summary>
        /// <param name="ID">The ID of the User you want to delete</param>
        /// <returns>An OK 200 with the remains of the Deleted User</returns>
        [HttpDelete]
        [Route("{ID:int}")]
        [Authorize(Roles = nameof(Permission.UserWrite))]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] int ID)
        {
            Logger.Info("Deleting User with ID: {}", ID);
            User? user = await userRepository.DeleteAsync(ID);

            if (user == null)
                return NotFound();

            Logger.Info("Deleted User: {}", JsonSerializer.Serialize(user));
            return Ok(mapper.Map<UserDto>(user));
        }

        [HttpPatch]
        [Route("UpdateUserPassword/{ID:int}")]
        [ValidateModel]
        [Authorize(Roles = nameof(Permission.UpdatePassword))]
        public async Task<IActionResult> UpdateUserPassword([FromRoute] int ID, [FromBody] UserDto toUpdate)
        {
            User? newUser = mapper.Map<User>(toUpdate);
            User? databaseUser = await userRepository.GetUsersPasswordHistory(ID);

            if (newUser.PasswordHashType == PasswordHashType.NotSet)
            {
                if (!PasswordHelper.ValidatePassword(newUser.Password))
                    return BadRequest("Invalid password");
                // Note Hashing currently happens on saving, so we don't hash here!

                string hashedPassword = PasswordHelper.GenerateSaltedPassword(newUser.Password, databaseUser.CreationDate.ToString());

                if (PasswordHelper.PasswordPreviouslyUsed(databaseUser, hashedPassword))
                {
                    return BadRequest("Previously used password");
                }
            }
            else
            {
                newUser.PasswordHashType = PasswordHashType.Salted;
                newUser.Password = databaseUser.Password;
            }

            User? user = await userRepository.GetByIDAsync(ID);

            await userRepository.UpdateUserPassword(user, newUser);
            if (user == null)
                return NotFound();

            return Ok(mapper.Map<UserDto>(user));
        }
    }
}
