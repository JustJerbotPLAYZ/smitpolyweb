using Estrategy.SmitPolyweb.ClientPortal.API.Data;
using Microsoft.EntityFrameworkCore;

public class BaseRepository<Tdomain> where Tdomain : class
{
    private readonly EstrategyPolywebDbContext dbContext;
    protected readonly DbSet<Tdomain> DBset;

    public BaseRepository(EstrategyPolywebDbContext dbContext, DbSet<Tdomain> dbSet)
    {
        this.dbContext = dbContext;
        DBset = dbSet;
    }

    private IQueryable<Tdomain> IncludeAllNavigations(IQueryable<Tdomain> query)
    {
        var entityType = dbContext.Model.FindEntityType(typeof(Tdomain)) ?? throw new InvalidOperationException($"Entity type {typeof(Tdomain).Name} is not part of the DbContext model.");

        // Include all navigation properties
        foreach (var navigation in entityType.GetNavigations())
        {
            query = query.Include(navigation.Name);
        }

        return query;
    }

    public async Task<Tdomain?> GetByIDAsync(int id)
    {
        var query = IncludeAllNavigations(DBset);
        var result = await query.FirstOrDefaultAsync(x => EF.Property<int>(x, "ID") == id);
        return result;
    }

    public async Task<List<Tdomain>> GetAllAsync()
    {
        var query = IncludeAllNavigations(DBset);
        return await query.ToListAsync();
    }

    public async Task<Tdomain> CreateAsync(Tdomain entity)
    {
        // Attach navigational properties if they have an ID
        foreach (var entry in dbContext.Entry(entity).References)
        {
            if (entry.TargetEntry != null)
            {
                var idProperty = entry.TargetEntry.Property("ID").CurrentValue;

                // Check if ID is not null and is a valid integer
                if (idProperty is int id && id != 0)
                {
                    entry.TargetEntry.State = EntityState.Unchanged; // Mark as existing
                }
            }
        }

        await DBset.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }


    public async Task<Tdomain?> UpdateAsync(int ID, Tdomain entity)
    {
        Tdomain? existingEntity = await GetByIDAsync(ID);
        if (existingEntity == null)
        {
            return null;
        }
        entity.GetType().GetProperty("ID")?.SetValue(entity, existingEntity.GetType().GetProperty("ID")?.GetValue(existingEntity));
        dbContext.Entry(existingEntity).CurrentValues.SetValues(entity);
        await dbContext.SaveChangesAsync();
        return existingEntity;
    }

    /// <summary>
    /// Deletes the entity with the given ID from the database
    /// </summary>
    /// <param name="ID">ID of entity to delete</param>
    /// <returns>The deleted entity if it was found and deleted, otherwise returns null</returns>
    public async Task<Tdomain?> DeleteAsync(int ID)
    {
        Tdomain? entity = await DBset.FirstOrDefaultAsync(x => EF.Property<int>(x, "ID") == ID);
        if (entity != null)
        {
            DBset.Remove(entity);
            await dbContext.SaveChangesAsync();
        }
        return entity;
    }
}
