using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace HotelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;

        public RoleController(RoleManager<IdentityRole> roleManager, AppDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        public IActionResult GetRoles()
        {
            var roles = _roleManager.Roles.Select(r => new { r.Id, r.Name }).ToList();
            return Ok(roles);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
                return BadRequest("Role already exists");

            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (result.Succeeded)
                return Ok("Role created");

            return BadRequest(result.Errors);
        }

        [HttpPost("{roleId}/permissions")]
        public async Task<IActionResult> AddPermissionToRole(string roleId, [FromBody] int permissionId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null) return NotFound("Role not found");

            if (_context.RolePermissions.Any(rp => rp.RoleId == roleId && rp.PermissionId == permissionId))
                return BadRequest("Permission already assigned to role");

            _context.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = permissionId });
            await _context.SaveChangesAsync();

            return Ok("Permission assigned to role");
        }

        [HttpGet("{roleId}/permissions")]
        public IActionResult GetRolePermissions(string roleId)
        {
            var perms = _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission.Name)
                .ToList();

            return Ok(perms);
        }

        [HttpDelete("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromRole(string roleId, int permissionId)
        {
            var rp = _context.RolePermissions.FirstOrDefault(r => r.RoleId == roleId && r.PermissionId == permissionId);
            if (rp == null) return NotFound("Permission not assigned to role");

            _context.RolePermissions.Remove(rp);
            await _context.SaveChangesAsync();

            return Ok("Permission removed from role");
        }
    }
}