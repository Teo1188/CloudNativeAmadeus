using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.Infrastructure.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly AppDbContext _context;

        public PermissionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Permission>> GetAllPermissionsAsync() => 
            await _context.Permissions.ToListAsync();

        public async Task<Permission?> GetPermissionByIdAsync(int id) => 
            await _context.Permissions.FindAsync(id);

        public async Task<Permission?> GetByNameAsync(string name) => 
            await _context.Permissions.FirstOrDefaultAsync(p => p.Name == name);

        public async Task AddPermissionAsync(Permission permission)
        {
            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePermissionAsync(Permission permission)
        {
            _context.Permissions.Update(permission);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePermissionAsync(int id)
        {
            var permission = await _context.Permissions.FindAsync(id);
            if (permission != null)
            {
                _context.Permissions.Remove(permission);
                await _context.SaveChangesAsync();
            }
        }
    }
}