using ExtraHours.Core.Models;

namespace ExtraHours.Core.Repositories
{
    public interface IPermissionRepository
    {
        Task<IEnumerable<Permission>> GetAllPermissionsAsync();
        Task<Permission?> GetPermissionByIdAsync(int id);
        Task<Permission?> GetByNameAsync(string name);
        Task AddPermissionAsync(Permission permission);
        Task UpdatePermissionAsync(Permission permission);
        Task DeletePermissionAsync(int id);
    }
}