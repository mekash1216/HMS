using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

public class RolePermission
{
    public string RoleId { get; set; } = string.Empty;
    public IdentityRole Role { get; set; } = null!;
    public int PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}

public class UserSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string UserId { get; set; } = null!;

    public IdentityUser User { get; set; } = null!;

    [Required]
    public string SessionToken { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;
}
