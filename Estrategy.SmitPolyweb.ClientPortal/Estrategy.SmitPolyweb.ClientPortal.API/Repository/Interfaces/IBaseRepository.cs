using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain.Interfaces;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces
{
    public interface IBaseRepostory<Tdomain> where Tdomain : class, IIdEntity
    {
        /// <summary>
        /// Searches the database for all stored Objects of a specified type
        /// </summary>
        /// <returns>All found objects</returns>
        Task<List<Tdomain>> GetAllAsync();

        /// <summary>
        /// Searches the Database for an Object of a specified type which matches the given ID
        /// </summary>
        /// <param name="ID">The ID you want to search the Database for</param>
        /// <returns>An Object matching the given ID</returns>
        Task<Tdomain?> GetByIDAsync(int ID);

        /// <summary>
        /// Adds the given Object to the database and gives it an ID
        /// </summary>
        /// <param name="identity">The Object to add to the database</param>
        /// <returns>The added Object including a newly assigned ID</returns>
        Task<Tdomain> CreateAsync(Tdomain identity);

        /// <summary>
        /// Updates an Object of the specified ID with the given Info
        /// </summary>
        /// <param name="ID">The ID of the object you want to Update</param>
        /// <param name="identity">The new information you want to update the Object with</param>
        /// <returns>An Object with the given updated information</returns>
        Task<Tdomain?> UpdateAsync(int ID, Tdomain identity);

        /// <summary>
        /// Delete an Object who's ID matches with the given ID
        /// </summary>
        /// <param name="ID">The ID of the Object you want to delete</param>
        /// <returns>The now deleted Object</returns>
        Task<Tdomain?> DeleteAsync(int ID);
    }
}
