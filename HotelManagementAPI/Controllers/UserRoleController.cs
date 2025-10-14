using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourNamespace.Dtos;  // Import DTO namespace

[Route("api/[controller]")]
[ApiController]
public class UserRoleController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;

    public UserRoleController(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }
  // GET: api/UserRole
[HttpGet]
public async Task<IActionResult> GetUsers()
{
    var users = _userManager.Users.ToList();
    var result = new List<object>();

    foreach (var user in users)
    {
        var roles = await _userManager.GetRolesAsync(user);
        result.Add(new
        {
            user.Id,
            user.UserName,
            user.Email,
            Roles = roles // include roles array
        });
    }

    return Ok(result);
}


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        var user = new IdentityUser 
        { 
            UserName = model.Username, 
            Email = model.Email 
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok("User registered successfully");
    }

    [HttpPost("{userId}/assign")]
    public async Task<IActionResult> AssignRole(string userId, [FromBody] string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found");

        var result = await _userManager.AddToRoleAsync(user, roleName);
        if (result.Succeeded)
            return Ok("Role assigned");

        return BadRequest(result.Errors);
    }

    [HttpPost("{userId}/remove")]
    public async Task<IActionResult> RemoveRole(string userId, [FromBody] string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found");

        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        if (result.Succeeded)
            return Ok("Role removed");

        return BadRequest(result.Errors);
    }

    [HttpGet("{userId}/roles")]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(roles);
    }
}
