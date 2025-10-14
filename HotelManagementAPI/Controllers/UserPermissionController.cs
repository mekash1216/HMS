using HotelManagementAPI.DTOs;
using HotelManagementAPI.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace HotelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserPermissionController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _context;

        public UserPermissionController(UserManager<IdentityUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("{userId}/permissions")]
        public async Task<IActionResult> AddPermissionToUser(string userId, [FromBody] int permissionId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            if (_context.UserPermissions.Any(up => up.UserId == userId && up.PermissionId == permissionId))
                return BadRequest("Permission already assigned to user");

            _context.UserPermissions.Add(new UserPermission { UserId = userId, PermissionId = permissionId });
            await _context.SaveChangesAsync();

            return Ok("Permission assigned to user");
        }

        [HttpGet("{userId}/permissions")]
        public IActionResult GetUserPermissions(string userId)
        {
            var permsFromRoles = (
                from ur in _context.UserRoles
                join rp in _context.RolePermissions on ur.RoleId equals rp.RoleId
                join p in _context.Permissions on rp.PermissionId equals p.Id
                where ur.UserId == userId
                select p.Name
            ).Distinct();

            var permsDirect = (
                from up in _context.UserPermissions
                join p in _context.Permissions on up.PermissionId equals p.Id
                where up.UserId == userId
                select p.Name
            );

            var allPerms = permsFromRoles.Union(permsDirect).ToList();

            return Ok(allPerms);
        }

        [HttpDelete("{userId}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromUser(string userId, int permissionId)
        {
            var up = _context.UserPermissions.FirstOrDefault(up => up.UserId == userId && up.PermissionId == permissionId);
            if (up == null) return NotFound("Permission not assigned to user");

            _context.UserPermissions.Remove(up);
            await _context.SaveChangesAsync();

            return Ok("Permission removed from user");
        }
    }
}