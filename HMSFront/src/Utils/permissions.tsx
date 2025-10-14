export const hasPermission = (perm: string) => {
  try {
    const stored = localStorage.getItem("userPermissions");
    const perms = stored ? JSON.parse(stored) : [];
    return perms.includes(perm);
  } catch (e) {
    console.error("Error reading permissions:", e);
    return false;
  }
};
