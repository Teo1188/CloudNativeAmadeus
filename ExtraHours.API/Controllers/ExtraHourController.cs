using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.API.Controllers
{
    [Route("api/extra-hours")]
    [ApiController]
    public class ExtraHourController : ControllerBase
    {
        private readonly IExtraHourService _extraHourService;

        public ExtraHourController(IExtraHourService extraHourService)
        {
            _extraHourService = extraHourService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var extraHours = await _extraHourService.GetAllExtraHours();
            return Ok(extraHours);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var extraHour = await _extraHourService.GetExtraHourById(id);
            if (extraHour == null) return NotFound();
            return Ok(extraHour);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var extraHours = await _extraHourService.GetExtraHoursByUser(userId);
            return Ok(extraHours);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExtraHour extraHour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _extraHourService.CreateExtraHour(extraHour);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ExtraHour extraHour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _extraHourService.UpdateExtraHour(id, extraHour);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _extraHourService.DeleteExtraHour(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id, [FromQuery] int approvedById)
        {
            var approved = await _extraHourService.ApproveExtraHour(id, approvedById);
            if (approved == null) return NotFound();
            return Ok(approved);
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id, [FromQuery] string reason)
        {
            var rejected = await _extraHourService.RejectExtraHour(id, reason);
            if (rejected == null) return NotFound();
            return Ok(rejected);
        }
    }
}