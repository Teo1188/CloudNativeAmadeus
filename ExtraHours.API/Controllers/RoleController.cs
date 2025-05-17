using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetRoles();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role = await _roleService.GetRoleById(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] Role role)
        {
            var createdRole = await _roleService.CreateRole(role);
            return CreatedAtAction(nameof(GetRoleById), new { id = createdRole.Id }, createdRole);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] Role updatedRole)
        {
            var role = await _roleService.UpdateRole(id, updatedRole);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var deleted = await _roleService.DeleteRole(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
