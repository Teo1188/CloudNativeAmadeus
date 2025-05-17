using ExtraHours.Core.Services;
using Microsoft.AspNetCore.Mvc;
 
namespace ExtraHours.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
 
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _userService.Authenticate(request.Email, request.Password);
            if (result.user == null || result.token == null)
                return Unauthorized(new { message = "Credenciales incorrectas." });
            return Ok(new { user = result.user, token = result.token });
        }
    }
 
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}