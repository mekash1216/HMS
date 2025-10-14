using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using HotelManagementAPI.Data;
using HotelManagementAPI.Dtos;
using HotelManagementAPI.Models;
using System.Threading.Tasks;
using System.Linq;

namespace HotelManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _context;

        public AuthController(UserManager<IdentityUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

    [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
                return Unauthorized("Invalid credentials");

            var activeSession = _context.UserSessions
                .FirstOrDefault(s => s.UserId == user.Id && s.IsActive);

            if (activeSession != null)
                return BadRequest("User already logged in from another device");

            var session = new UserSession
            {
                UserId = user.Id,
                SessionToken = Guid.NewGuid().ToString(),
                IsActive = true
            };

            _context.UserSessions.Add(session);
            await _context.SaveChangesAsync();

            // Fetch permissions (merged from roles + direct)
            var permsFromRoles = (
                from ur in _context.UserRoles
                join rp in _context.RolePermissions on ur.RoleId equals rp.RoleId
                join p in _context.Permissions on rp.PermissionId equals p.Id
                where ur.UserId == user.Id
                select p.Name
            ).Distinct();

            var permsDirect = (
                from up in _context.UserPermissions
                join p in _context.Permissions on up.PermissionId equals p.Id
                where up.UserId == user.Id
                select p.Name
            );

            var allPerms = permsFromRoles.Union(permsDirect).ToList();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                sessionToken = session.SessionToken,
                roles,
                permissions = allPerms
            });
        }
  
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutDto dto)
        {
            var session = _context.UserSessions
                .FirstOrDefault(s => s.SessionToken == dto.SessionToken && s.IsActive);

            if (session == null)
                return BadRequest("Session not found or already logged out");

            session.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok("Logged out successfully");
        }
    }
}
