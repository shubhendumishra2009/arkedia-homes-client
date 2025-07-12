import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert, Switch, FormControlLabel, Tab, Tabs } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import styles from '@/styles/Admin.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function UsersAccessControl() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'tenant',
    status: 'active',
    employee_id: ''
  });
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch users data
        fetchUsers();
        // Fetch employees data
        fetchEmployees();
      }
    }
  }, [user, loading, router]);
  
  // Fetch employees that can be assigned as users
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Fetch employees from API
      const response = await axios.get(`${API_URL}/users/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setEmployees(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch employees',
        severity: 'error'
      });
    } finally {
      setIsLoadingEmployees(false);
    }
  };
  
  // Fetch permissions for a user
  const fetchUserPermissions = async (userId) => {
    setIsLoadingPermissions(true);
    try {
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Fetch permissions from API
      const response = await axios.get(`${API_URL}/users/${userId}/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setPermissions(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch permissions',
        severity: 'error'
      });
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Fetch users from API
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Transform the data to match our component's expected format
        const fetchedUsers = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.is_active ? 'active' : 'inactive',
          lastLogin: user.last_login,
          employeeId: user.employee_id || null
        }));
        
        setUsers(fetchedUsers);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch users',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        employee_id: user.employeeId || ''
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'tenant',
        status: 'active',
        employee_id: ''
      });
    }
    setOpenDialog(true);
  };
  
  // Open permissions dialog for a user
  const handleOpenPermissionsDialog = async (user) => {
    setSelectedUser(user);
    await fetchUserPermissions(user.id);
    setOpenPermissionsDialog(true);
  };
  
  // Close permissions dialog
  const handleClosePermissionsDialog = () => {
    setOpenPermissionsDialog(false);
    setSelectedUser(null);
    setPermissions([]);
  };
  
  // Handle permission change
  const handlePermissionChange = (formId, field, value) => {
    setPermissions(permissions.map(perm => 
      perm.id === formId ? { ...perm, [field]: value } : perm
    ));
  };
  
  // Save user permissions
  const handleSavePermissions = async () => {
    try {
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Format permissions data for API - Only include permissions where is_active is true
      const permissionsData = permissions
        .filter(perm => perm.is_active === 1 || perm.is_active === true)
        .map(perm => ({
          form_id: perm.id,
          has_add_right: perm.has_add_right === 1 || perm.has_add_right === true,
          has_update_right: perm.has_update_right === 1 || perm.has_update_right === true,
          has_delete_right: perm.has_delete_right === 1 || perm.has_delete_right === true,
          is_active: true // Since we filter for active, this is always true
        }));

      // Update permissions via API
      const response = await axios.post(`${API_URL}/users/${selectedUser.id}/permissions`, {
        permissions: permissionsData
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Permissions updated successfully',
          severity: 'success'
        });
        handleClosePermissionsDialog();
      } else {
        throw new Error(response.data.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save permissions',
        severity: 'error'
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If employee_id is changed, auto-populate name and email from selected employee
    if (name === 'employee_id' && value) {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(value));
      if (selectedEmployee) {
        setFormData({
          ...formData,
          [name]: value,
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          role: 'employee' // Set role to employee by default
        });
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked ? 'active' : 'inactive'
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      const validationErrors = [];
      if (!formData.name) validationErrors.push('Name is required');
      if (!formData.email) validationErrors.push('Email is required');
      if (!formData.role) validationErrors.push('Role is required');
      
      if (validationErrors.length > 0) {
        setSnackbar({
          open: true,
          message: `Please fix the following errors: ${validationErrors.join(', ')}`,
          severity: 'error'
        });
        return;
      }
      
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Prepare data for API call
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.status === 'active',
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null
      };

      console.log('Submitting user data:', userData);

      if (selectedUser) {
        // Update existing user
        const response = await axios.put(`${API_URL}/users/${selectedUser.id}`, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          // Refresh the users list
          fetchUsers();
          setSnackbar({
            open: true,
            message: 'User updated successfully',
            severity: 'success'
          });
        } else {
          throw new Error(response.data.message || 'Failed to update user');
        }
      } else {
        // Create new user
        const response = await axios.post(`${API_URL}/users`, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          // Refresh the users list
          fetchUsers();
          setSnackbar({
            open: true,
            message: 'User created successfully',
            severity: 'success'
          });
        } else {
          throw new Error(response.data.message || 'Failed to create user');
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      
      // Handle validation errors from backend
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        
        if (errors && Array.isArray(errors)) {
          // Display validation errors
          setSnackbar({
            open: true,
            message: `${message}: ${errors.join(', ')}`,
            severity: 'error'
          });
        } else {
          // Display general error message
          setSnackbar({
            open: true,
            message: message || error.message || 'Failed to save user',
            severity: 'error'
          });
        }
      } else {
        // Handle other errors
        setSnackbar({
          open: true,
          message: error.message || 'Failed to save user',
          severity: 'error'
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      // Get API URL from environment variables
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }

      // Delete user via API
      const response = await axios.delete(`${API_URL}/users/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Refresh the users list
        fetchUsers();
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'tenant':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Users Access Control | Arkedia Homes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
              Users Access Control
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add New User
            </Button>
          </Box>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role.toUpperCase()} 
                          color={getRoleChipColor(user.role)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>{user.position || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status.toUpperCase()} 
                          color={getStatusChipColor(user.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell align="right">
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <Tooltip title="Edit User" arrow>
      <IconButton
        className={styles.secondaryButton}
        color="primary"
        onClick={() => handleOpenDialog(user)}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Manage Permissions" arrow>
      <IconButton
        className={styles.secondaryButton}
        color="secondary"
        onClick={() => handleOpenPermissionsDialog(user)}
        size="small"
        sx={{ ml: 1 }}
      >
        <AdminPanelSettingsIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete User" arrow>
      <IconButton
        className={styles.accentButton}
        color="error"
        onClick={() => handleOpenDeleteDialog(user)}
        size="small"
        disabled={user.id === 1} // Prevent deleting the main admin
        sx={{ ml: 1 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Link to Employee</InputLabel>
                <Select
                  name="employee_id"
                  value={formData.employee_id}
                  label="Link to Employee"
                  onChange={handleInputChange}
                  disabled={isLoadingEmployees}
                >
                  <MenuItem value="">None</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position} ({employee.department})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {formData.employee_id && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Employee Information
                  </Typography>
                  {employees.find(emp => emp.id === parseInt(formData.employee_id)) && (
                    <>
                      <Typography variant="body2">
                        <strong>Department:</strong> {employees.find(emp => emp.id === parseInt(formData.employee_id)).department}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Position:</strong> {employees.find(emp => emp.id === parseInt(formData.employee_id)).position}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="tenant">Tenant</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                    color="success"
                  />
                }
                label={`Status: ${formData.status === 'active' ? 'Active' : 'Inactive'}`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={openPermissionsDialog} onClose={handleClosePermissionsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Manage Permissions for {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          {isLoadingPermissions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Page</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell align="center">View</TableCell>
                    <TableCell align="center">Add</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map((perm) => (
                    <TableRow key={perm.id}>
                      <TableCell>{perm.page_name}</TableCell>
                      <TableCell>{perm.page_url}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={perm.is_active === 1 || perm.is_active === true}
                          onChange={(e) => handlePermissionChange(perm.id, 'is_active', e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={perm.has_add_right === 1 || perm.has_add_right === true}
                          onChange={(e) => handlePermissionChange(perm.id, 'has_add_right', e.target.checked)}
                          disabled={!perm.default_add}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={perm.has_update_right === 1 || perm.has_update_right === true}
                          onChange={(e) => handlePermissionChange(perm.id, 'has_update_right', e.target.checked)}
                          disabled={!perm.default_update}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={perm.has_delete_right === 1 || perm.has_delete_right === true}
                          onChange={(e) => handlePermissionChange(perm.id, 'has_delete_right', e.target.checked)}
                          disabled={!perm.default_delete}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionsDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePermissions} 
            variant="contained" 
            color="primary"
            disabled={isLoadingPermissions}
          >
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}