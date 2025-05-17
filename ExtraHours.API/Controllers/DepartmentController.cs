using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controllers
{
    [Route("api/departments")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _departmentService.GetDepartments();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var department = await _departmentService.GetDepartmentById(id);
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            var createdDepartment = await _departmentService.CreateDepartment(department);
            return CreatedAtAction(nameof(GetDepartmentById), new { id = createdDepartment.Id }, createdDepartment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department updatedDepartment)
        {
            var department = await _departmentService.UpdateDepartment(id, updatedDepartment);
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var deleted = await _departmentService.DeleteDepartment(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
