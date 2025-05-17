using ExtraHours.Core.Models;

namespace ExtraHours.Core.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetRoles();
        Task<Role?> GetRoleById(int id);
        Task<Role> CreateRole(Role role);
        Task<Role?> UpdateRole(int id, Role updatedRole);
        Task<bool> DeleteRole(int id);
    }

}
