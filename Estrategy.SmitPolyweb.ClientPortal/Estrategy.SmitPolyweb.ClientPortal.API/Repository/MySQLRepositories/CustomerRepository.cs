using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Domain;
using Estrategy.SmitPolyweb.ClientPortal.API.Models.Dto;
using Estrategy.SmitPolyweb.ClientPortal.API.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Estrategy.SmitPolyweb.ClientPortal.API.Repository.MySQLRepositories
{
    public class CustomerRepository : BaseRepository<Customer>, ICustomerRepository
    {
        private readonly EstrategyPolywebDbContext dbContext;

        public CustomerRepository(EstrategyPolywebDbContext dbContext) : base(dbContext, dbContext.Customers)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Customer>> GetAllFilteredAsync(CustomerFilterDto customerDto)
        {
            // Start the query as IQueryable to build the filters dynamically
            // This is to reduce the load on the database by filtering imidiately instead of getting all Customers and filtering after that
            var query = dbContext.Customers.AsQueryable();

            #region search

            if (!string.IsNullOrEmpty(customerDto.Email))
                query = query.Where(cust => cust.Email.Contains(customerDto.Email));

            if (!string.IsNullOrEmpty(customerDto.DebtorNumber))
                query = query.Where(cust => cust.DebtorNumber.Contains(customerDto.DebtorNumber));

            if (!string.IsNullOrEmpty(customerDto.SearchName))
                query = query.Where(cust => cust.SearchName.Contains(customerDto.SearchName));

            if (!string.IsNullOrEmpty(customerDto.CustomerName))
                query = query.Where(cust => cust.CustomerName.Contains(customerDto.CustomerName));

            if (!string.IsNullOrEmpty(customerDto.PhoneNumber))
                query = query.Where(cust => cust.PhoneNumber.Contains(customerDto.PhoneNumber));

            if (!string.IsNullOrEmpty(customerDto.FaxNumber))
                query = query.Where(cust => cust.FaxNumber.Contains(customerDto.FaxNumber));

            #endregion search

            // Execute the query and return the filtered list
            return await query.ToListAsync();
        }

        public async Task<List<User>> GetAllUsersByCustomerID(int ID)
        {
            return await dbContext.Users.Where((user) => user.CustomerID == ID).ToListAsync();
        }
    }
}


