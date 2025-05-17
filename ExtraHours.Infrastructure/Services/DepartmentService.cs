using ExtraHours.Core.Models;
using ExtraHours.Core.Repositories;
using ExtraHours.Core.Services;

namespace ExtraHours.Infrastructure.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<IEnumerable<Department>> GetDepartments()
        {
            return await _departmentRepository.GetAllDepartmentsAsync();
        }

        public async Task<Department?> GetDepartmentById(int id)
        {
            return await _departmentRepository.GetDepartmentByIdAsync(id);
        }

        public async Task<Department> CreateDepartment(Department department)
        {
            await _departmentRepository.AddDepartmentAsync(department);
            return department;
        }

        public async Task<Department?> UpdateDepartment(int id, Department updatedDepartment)
        {
            var existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(id);
            if (existingDepartment == null) return null;

            existingDepartment.Name = updatedDepartment.Name;
            existingDepartment.Location = updatedDepartment.Location;

            await _departmentRepository.UpdateDepartmentAsync(existingDepartment);
            return existingDepartment;
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            var existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(id);
            if (existingDepartment == null) return false;

            await _departmentRepository.DeleteDepartmentAsync(id);
            return true;
        }
    }
}
