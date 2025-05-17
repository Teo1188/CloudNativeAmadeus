using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.API.Controllers
{
    [Route("api/approvals")]
    [ApiController]
    public class ApprovalController : ControllerBase
    {
        private readonly IApprovalService _approvalService;

        public ApprovalController(IApprovalService approvalService)
        {
            _approvalService = approvalService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var approvals = await _approvalService.GetAllApprovals();
            return Ok(approvals);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var approval = await _approvalService.GetApprovalById(id);
            if (approval == null) return NotFound();
            return Ok(approval);
        }

        [HttpGet("extra-hour/{extraHourId}")]
        public async Task<IActionResult> GetByExtraHour(int extraHourId)
        {
            var approvals = await _approvalService.GetApprovalsByExtraHour(extraHourId);
            return Ok(approvals);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var approvals = await _approvalService.GetApprovalsByUser(userId);
            return Ok(approvals);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Approval approval)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _approvalService.CreateApproval(approval);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Approval approval)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _approvalService.UpdateApproval(id, approval);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _approvalService.DeleteApproval(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost("approve/{extraHourId}")]
        public async Task<IActionResult> Approve(int extraHourId, [FromQuery] int userId, [FromQuery] string annotations)
        {
            var approval = await _approvalService.ApproveExtraHour(extraHourId, userId, annotations);
            if (approval == null) return NotFound();
            return Ok(approval);
        }

        [HttpPost("reject/{extraHourId}")]
        public async Task<IActionResult> Reject(int extraHourId, [FromQuery] int userId, [FromQuery] string annotations)
        {
            var approval = await _approvalService.RejectExtraHour(extraHourId, userId, annotations);
            if (approval == null) return NotFound();
            return Ok(approval);
        }
    }
}