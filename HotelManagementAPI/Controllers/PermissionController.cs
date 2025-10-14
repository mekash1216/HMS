using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace HotelManagementAPI.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class PermissionController : ControllerBase
{
    private readonly AppDbContext _context;

    public PermissionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetPermissions()
    {
        var permissions = _context.Permissions.Select(p => new { p.Id, p.Name }).ToList();
        return Ok(permissions);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreatePermission([FromBody] string permissionName)
    {
        if (_context.Permissions.Any(p => p.Name == permissionName))
            return BadRequest("Permission already exists");

        var permission = new Permission { Name = permissionName };
        _context.Permissions.Add(permission);
        await _context.SaveChangesAsync();

        return Ok("Permission created");
    }
}
}