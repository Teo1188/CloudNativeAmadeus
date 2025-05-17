using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;
using ExtraHours.Core.Models;

namespace ExtraHours.Infrastructure.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<IEnumerable<Role>> GetRoles()
        {
            return await _roleRepository.GetAllRolesAsync();
        }

        public async Task<Role> CreateRole(Role role)
        {
            await _roleRepository.AddRoleAsync(role);
            return role;
        }

        public async Task<Role?> GetRoleById(int id)
        {
            return await _roleRepository.GetRoleByIdAsync(id);
        }

        public async Task<Role?> UpdateRole(int id, Role updatedRole)
        {
            var existingRole = await _roleRepository.GetRoleByIdAsync(id);
            if (existingRole == null) return null;

            existingRole.Name = updatedRole.Name;
            await _roleRepository.UpdateRoleAsync(existingRole);
            return existingRole;
        }

        public async Task<bool> DeleteRole(int id)
        {
            var existingRole = await _roleRepository.GetRoleByIdAsync(id);
            if (existingRole == null) return false;

            await _roleRepository.DeleteRoleAsync(id);
            return true;
        }
    }
}
