using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public UserRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Users)
        {
            this.dbContext = dbContext;
        }


        /// <summary>
        /// Searches the database for a user with the email given in the email parameter
        /// </summary>
        /// <param name="Email">The email to search for</param>
        /// <returns>A User with this email, or null if it wasn't found</returns>
        public async Task<User?> GetByEmailAsync(string Email)
        {
            return await dbContext.Users.Include(nameof(Role)).Include(nameof(RefreshToken)).Include(x => x.previouslyUsedPasswords).FirstOrDefaultAsync(user => user.Email == Email);
        }

        public async Task<User?> GetUsersPasswordHistory(int id)
        {
            return await dbContext.Users.Include(x => x.previouslyUsedPasswords).FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<User?> UpdateUserPassword(User user, User newUser)
        {
            user.Password = newUser.Password;
            user.PasswordHashType = newUser.PasswordHashType;
            await dbContext.SaveChangesAsync();
            return user;

        }
    }
}
