using ExtraHours.Core.Models;

namespace ExtraHours.Core.Services
{
    public interface IDepartmentService
    {
        Task<IEnumerable<Department>> GetDepartments();
        Task<Department?> GetDepartmentById(int id);
        Task<Department> CreateDepartment(Department department);
        Task<Department?> UpdateDepartment(int id, Department updatedDepartment);
        Task<bool> DeleteDepartment(int id);
    }
}
