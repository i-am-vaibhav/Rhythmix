using Microsoft.AspNetCore.Mvc;
using rhythmix_user_services.DTOs;
using rhythmix_user_services.Services;

namespace rhythmix_user_services.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> createUser([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userService.CreateUserAsync(dto);
                return CreatedAtAction(nameof(getUser), new { value = user.userId }, user);
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet("{value}")]
        public async Task<IActionResult> getUser(string value)
        {
            var user = await _userService.GetUserAsync(value);
            if (user == null)
                return NotFound("User not found.");

            return Ok(user);
        }
    }
}
