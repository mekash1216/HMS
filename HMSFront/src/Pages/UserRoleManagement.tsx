// --- IMPORTS ---
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Drawer,
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  getUsers,
  registerUser,
  getRoles,
  createRole,
  assignRoleToUser,
  removeRoleFromUser,
  getAllPermissions,
  assignPermissionToUser,
  removePermissionFromUser
} from '../Services/Services';

import { User } from '../Models/User';
import { Role } from '../Models/Role';
import { Permission } from '../Models/Permission';

const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);

  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [newRoleName, setNewRoleName] = useState('');

  // permission assign states
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [selectedPermissionForUser, setSelectedPermissionForUser] = useState<number | ''>('');

  // role assign states
  const [assigningRoleUserId, setAssigningRoleUserId] = useState<string | null>(null);
  const [selectedRoleForUser, setSelectedRoleForUser] = useState<string>('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      const normalizedUsers = fetchedUsers.map((u: any) => ({
        id: u.id || u.userId,
        userName: u.username || u.userName || u.name || '',
        email: u.email,
        roles: u.roles || [],
        permissions: u.permissions || []
      }));
      setUsers(normalizedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to load roles', 'error');
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await getAllPermissions();
      setPermissions(data);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to load permissions', 'error');
    }
  };

  const showSnackbar = (msg: string, severity: 'success' | 'error') => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleRegisterUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      showSnackbar('Please fill all user fields', 'error');
      return;
    }
    try {
      await registerUser(newUser);
      showSnackbar('User registered successfully', 'success');
      setUserDrawerOpen(false);
      setNewUser({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data && Array.isArray(error.response.data)
          ? error.response.data.map((e: any) => e.description).join(' ')
          : 'Failed to register user';
      showSnackbar(msg, 'error');
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      showSnackbar('Please enter a role name', 'error');
      return;
    }
    try {
      await createRole(newRoleName.trim());
      showSnackbar('Role created successfully', 'success');
      setRoleDrawerOpen(false);
      setNewRoleName('');
      fetchRoles();
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to create role', 'error');
    }
  };

  const handleRemoveRole = async (userId: string, roleName: string) => {
    try {
      await removeRoleFromUser(userId, roleName);
      showSnackbar('Role removed from user', 'success');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to remove role', 'error');
    }
  };

  const handleAssignRole = async (userId: string) => {
    if (!selectedRoleForUser) {
      showSnackbar('Please select a role', 'error');
      return;
    }
    try {
      await assignRoleToUser(userId, selectedRoleForUser);
      showSnackbar('Role assigned to user', 'success');
      setAssigningRoleUserId(null);
      setSelectedRoleForUser('');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to assign role', 'error');
    }
  };

  const handleAssignPermission = async (userId: string) => {
    if (!selectedPermissionForUser) {
      showSnackbar('Please select a permission', 'error');
      return;
    }
    try {
      await assignPermissionToUser(userId, Number(selectedPermissionForUser));
      showSnackbar('Permission assigned to user', 'success');
      setAssigningUserId(null);
      setSelectedPermissionForUser('');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to assign permission', 'error');
    }
  };

  const handleRemovePermission = async (userId: string, permissionName: string) => {
    try {
      await removePermissionFromUser(userId, permissionName);
      showSnackbar('Permission removed from user', 'success');
      fetchUsers();
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to remove permission', 'error');
    }
  };

  const columns: GridColDef[] = [
    { field: 'userName', headerName: 'User Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      renderCell: (params) => {
        const user: User = params.row;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {(user.roles || []).map((role) => (
              <Chip
                key={role}
                label={role}
                onDelete={() => handleRemoveRole(user.id, role)}
                color="primary"
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}

            {assigningRoleUserId === user.id ? (
              <>
                <TextField
                  select
                  size="small"
                  value={selectedRoleForUser}
                  onChange={(e) => setSelectedRoleForUser(e.target.value)}
                  sx={{ width: 150, ml: 1 }}
                >
                  {roles
                    .filter((r) => !(user.roles || []).includes(r.name))
                    .map((r) => (
                      <MenuItem key={r.id} value={r.name}>
                        {r.name}
                      </MenuItem>
                    ))}
                </TextField>
                <Button
                  onClick={() => handleAssignRole(user.id)}
                  size="small"
                  sx={{ ml: 1 }}
                  variant="contained"
                >
                  Assign
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setAssigningRoleUserId(user.id);
                  setSelectedRoleForUser('');
                }}
                size="small"
                sx={{ ml: 1 }}
              >
                + Add Role
              </Button>
            )}
          </Box>
        );
      }
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 1,
      renderCell: (params) => {
        const user: User = params.row;
        return (
          <Box>
            {(user.permissions || []).map((perm) => (
              <Chip
                key={perm}
                label={perm}
                onDelete={() => handleRemovePermission(user.id, perm)}
                color="secondary"
                size="small"
                sx={{ mr: 0.5 }}
              />
            ))}
            {assigningUserId === user.id ? (
              <>
                <TextField
                  select
                  size="small"
                  value={selectedPermissionForUser}
                  onChange={(e) => setSelectedPermissionForUser(Number(e.target.value))}
                  sx={{ width: 150, ml: 1 }}
                >
                  {permissions
                    .filter((p) => !(user.permissions || []).includes(p.name))
                    .map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                </TextField>
                <Button
                  onClick={() => handleAssignPermission(user.id)}
                  size="small"
                  sx={{ ml: 1 }}
                  variant="contained"
                >
                  Assign
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setAssigningUserId(user.id);
                  setSelectedPermissionForUser('');
                }}
                size="small"
                sx={{ ml: 1 }}
              >
                + Add Permission
              </Button>
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUserDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            Register User
          </Button>
          <Button variant="contained" onClick={() => setRoleDrawerOpen(true)}>
            Create Role
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={users.filter(
          (u) =>
            (u.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        autoHeight
      />

      {/* User Drawer */}
      <Drawer
        anchor="right"
        open={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        PaperProps={{ sx: { width: 350, p: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          Register New User
        </Typography>
        <TextField
          label="User Name"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegisterUser}
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Drawer>

      {/* Role Drawer */}
      <Drawer
        anchor="right"
        open={roleDrawerOpen}
        onClose={() => setRoleDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, p: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Role
        </Typography>
        <TextField
          label="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleCreateRole}
          sx={{ mt: 2 }}
        >
          Create Role
        </Button>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserRoleManagement;
