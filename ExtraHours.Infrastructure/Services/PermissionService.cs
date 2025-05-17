using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;

namespace ExtraHours.Infrastructure.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;

        public PermissionService(IPermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        public async Task<IEnumerable<Permission>> GetPermissions()
        {
            return await _permissionRepository.GetAllPermissionsAsync();
        }

        public async Task<Permission?> GetPermissionById(int id)
        {
            return await _permissionRepository.GetPermissionByIdAsync(id);
        }

        public async Task<Permission> CreatePermission(Permission permission)
        {
            await _permissionRepository.AddPermissionAsync(permission);
            return permission;
        }

        public async Task<Permission?> UpdatePermission(int id, Permission updatedPermission)
        {
            var existingPermission = await _permissionRepository.GetPermissionByIdAsync(id);
            if (existingPermission == null) return null;

            existingPermission.Name = updatedPermission.Name;
            existingPermission.Description = updatedPermission.Description;
            existingPermission.UpdatedAt = DateTime.UtcNow;

            await _permissionRepository.UpdatePermissionAsync(existingPermission);
            return existingPermission;
        }

        public async Task<bool> DeletePermission(int id)
        {
            var existingPermission = await _permissionRepository.GetPermissionByIdAsync(id);
            if (existingPermission == null) return false;

            await _permissionRepository.DeletePermissionAsync(id);
            return true;
        }
    }
}