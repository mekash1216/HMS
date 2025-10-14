using Microsoft.AspNetCore.Identity;

public class UserPermission
{
    public string UserId { get; set; } = string.Empty;
    public IdentityUser User { get; set; } = null!;
    public int PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}