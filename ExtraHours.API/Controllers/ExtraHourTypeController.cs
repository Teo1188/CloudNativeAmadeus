using ExtraHours.Core.Models;
using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.API.Controllers
{
    [Route("api/extra-hour-types")]
    [ApiController]
    public class ExtraHourTypeController : ControllerBase
    {
        private readonly IExtraHourTypeService _extraHourTypeService;

        public ExtraHourTypeController(IExtraHourTypeService extraHourTypeService)
        {
            _extraHourTypeService = extraHourTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraHourType>>> GetAll()
        {
            var types = await _extraHourTypeService.GetAllTypes();
            return Ok(types);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHourType>> GetById(int id)
        {
            var type = await _extraHourTypeService.GetTypeById(id);
            if (type == null) return NotFound();
            return Ok(type);
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHourType>> Create([FromBody] ExtraHourType extraHourType)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdType = await _extraHourTypeService.CreateType(extraHourType);
                return CreatedAtAction(nameof(GetById), new { id = createdType.Id }, createdType);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExtraHourType>> Update(int id, [FromBody] ExtraHourType updatedType)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var type = await _extraHourTypeService.UpdateType(id, updatedType);
                if (type == null) return NotFound();
                return Ok(type);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _extraHourTypeService.DeleteType(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}