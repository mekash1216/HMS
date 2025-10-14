import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Drawer,
  TextField,
  Snackbar,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import {
  getRoles,
  createRole,
  getAllPermissions,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  addNewPermission,
} from "../Services/Services";
import { Role } from "../Models/Role";

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);

  const [permissionDrawerOpen, setPermissionDrawerOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [allPermissions, setAllPermissions] = useState<{ id: number; name: string }[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load roles", "error");
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      showSnackbar("Please enter a role name", "error");
      return;
    }
    try {
      await createRole(newRoleName.trim());
      showSnackbar("Role created successfully", "success");
      setRoleDrawerOpen(false);
      setNewRoleName("");
      fetchRoles();
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to create role", "error");
    }
  };

  const showSnackbar = (msg: string, severity: "success" | "error") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const openPermissionDrawer = async (roleId: string) => {
    setSelectedRoleId(roleId);
    setPermissionDrawerOpen(true);
    setLoadingPermissions(true);
    try {
      const allPerms = await getAllPermissions();
      const assignedPerms = await getRolePermissions(roleId);
      setAllPermissions(allPerms);
      setRolePermissions(assignedPerms);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load permissions", "error");
    }
    setLoadingPermissions(false);
  };

 const togglePermission = async (permissionName: string, permissionId: number, checked: boolean) => {
  if (!selectedRoleId) return;
  try {
    if (checked) {
      await addPermissionToRole(selectedRoleId, permissionId);
      setRolePermissions((prev) => [...prev, permissionName]);
    } else {
      await removePermissionFromRole(selectedRoleId, permissionId.toString());
      setRolePermissions((prev) => prev.filter((p) => p !== permissionName));
    }
    showSnackbar("Permissions updated", "success");
  } catch (error) {
    console.error(error);
    showSnackbar("Failed to update permission", "error");
  }
};

  const handleAddNewPermission = async () => {
    if (!newPermissionName.trim() || !selectedRoleId) {
      showSnackbar("Please enter a permission name", "error");
      return;
    }
    try {
      await addNewPermission(newPermissionName.trim());
      if (!allPermissions.some(p => p.name === newPermissionName.trim())) {
        setAllPermissions((prev) => [...prev, { id: Date.now(), name: newPermissionName.trim() }]); // temp ID
      }
      setRolePermissions((prev) => [...prev, newPermissionName.trim()]);
      setNewPermissionName("");
      showSnackbar("Permission created and assigned", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to add permission", "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Role Name", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => openPermissionDrawer(params.row.id)}
        >
          Manage Permissions
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h5">Role Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setRoleDrawerOpen(true)}
        >
          Create Role
        </Button>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={roles}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          pagination
          sx={{ minWidth: 600 }}
        />
      </Box>

      <Drawer
        anchor="right"
        open={permissionDrawerOpen}
        onClose={() => setPermissionDrawerOpen(false)}
        PaperProps={{ sx: { width: 350, p: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          Manage Permissions
        </Typography>

        {loadingPermissions ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Add New Permission
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                label="New Permission"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                size="small"
                fullWidth
              />
              <Button variant="contained" onClick={handleAddNewPermission}>
                Add
              </Button>
            </Box>

            <FormGroup sx={{ mt: 2 }}>
              {allPermissions.map((perm) => (
                <FormControlLabel
                  key={perm.id}
                  control={
                    <Checkbox
                      checked={rolePermissions.includes(perm.name)}
                      onChange={(e) =>
                        togglePermission(perm.name, perm.id, e.target.checked)
                      }
                    />
                  }
                  label={perm.name}
                />
              ))}
            </FormGroup>
          </>
        )}

        <Button
          onClick={() => setPermissionDrawerOpen(false)}
          sx={{ mt: 3 }}
          variant="contained"
          fullWidth
        >
          Close
        </Button>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleManagement;
