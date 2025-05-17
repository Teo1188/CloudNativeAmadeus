using ExtraHours.Core.Models;

namespace ExtraHours.Core.Services
{
    public interface IPermissionService
    {
        Task<IEnumerable<Permission>> GetPermissions();
        Task<Permission?> GetPermissionById(int id);
        Task<Permission> CreatePermission(Permission permission);
        Task<Permission?> UpdatePermission(int id, Permission updatedPermission);
        Task<bool> DeletePermission(int id);
    }
}