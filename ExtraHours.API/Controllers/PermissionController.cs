using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controllers
{
    [Route("api/permissions")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPermissions()
        {
            var permissions = await _permissionService.GetPermissions();
            return Ok(permissions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPermissionById(int id)
        {
            var permission = await _permissionService.GetPermissionById(id);
            if (permission == null) return NotFound();
            return Ok(permission);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePermission([FromBody] Permission permission)
        {
            var createdPermission = await _permissionService.CreatePermission(permission);
            return CreatedAtAction(nameof(GetPermissionById), new { id = createdPermission.Id }, createdPermission);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] Permission updatedPermission)
        {
            var permission = await _permissionService.UpdatePermission(id, updatedPermission);
            if (permission == null) return NotFound();
            return Ok(permission);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(int id)
        {
            var deleted = await _permissionService.DeletePermission(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}