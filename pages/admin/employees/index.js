import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert, Chip, ListItemText, Checkbox, OutlinedInput } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';
import axios from 'axios';

export default function EmployeeManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expandedEmployees, setExpandedEmployees] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: 'other',
    position: '',
    hire_date: '',
    salary: 0,
    emergency_contact: '',
    emergency_phone: '',
    is_app_user: false,
    status: 'active',
    notes: '',
    propertyIds: [],
    primaryPropertyId: null
  });
  
  // Available properties for assignment
  const [availableProperties, setAvailableProperties] = useState([]);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch employees data
        fetchEmployees();
        // Fetch available properties
        fetchAvailableProperties();
      }
    }
  }, [user, loading, router]);

  const fetchAvailableProperties = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${API_URL}/employees/properties/available`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAvailableProperties(response.data);
    } catch (error) {
      console.error('Error fetching available properties:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch available properties',
        severity: 'error'
      });
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${API_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Axios automatically throws for error status codes
      // and response.data already contains the parsed JSON
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch employees',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, employee = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && employee) {
      setSelectedEmployee(employee);
      
      // Extract property IDs and primary property ID
      const propertyIds = employee.properties ? employee.properties.map(prop => prop.id) : [];
      const primaryProperty = employee.properties ? employee.properties.find(prop => prop.EmployeeProperty?.is_primary) : null;
      const primaryPropertyId = primaryProperty ? primaryProperty.id : null;
      
      setFormData({
        name: employee.name,
        email: employee.email || '',
        phone: employee.phone,
        address: employee.address || '',
        department: employee.department,
        position: employee.position,
        hire_date: formatDateForInput(employee.hire_date),
        salary: employee.salary,
        emergency_contact: employee.emergency_contact || '',
        emergency_phone: employee.emergency_phone || '',
        is_app_user: employee.is_app_user === 1 || employee.is_app_user === true || (employee.is_app_user && employee.is_app_user.toString() === '1'),
        status: employee.status,
        notes: employee.notes || '',
        propertyIds: propertyIds,
        primaryPropertyId: primaryPropertyId
      });
    } else {
      // Reset form for add mode and set today's date as default for hire_date
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        department: 'other',
        position: '',
        hire_date: today,
        salary: 0,
        emergency_contact: '',
        emergency_phone: '',
        is_app_user: false,
        status: 'active',
        notes: '',
        propertyIds: [],
        primaryPropertyId: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleOpenDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePropertyChange = (event) => {
    const selectedPropertyIds = event.target.value;
    setFormData({
      ...formData,
      propertyIds: selectedPropertyIds,
      // Reset primary property if it's no longer in the selected properties
      primaryPropertyId: selectedPropertyIds.includes(formData.primaryPropertyId) ? formData.primaryPropertyId : null
    });
  };
  
  const handlePrimaryPropertyChange = (event) => {
    setFormData({
      ...formData,
      primaryPropertyId: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // Ensure all required fields are present and properly formatted
      if (!formData.name || !formData.phone || !formData.position || !formData.hire_date) {
        throw new Error('Please fill in all required fields');
      }

      // Format date and ensure salary is a number
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary) || 0,
        hire_date: formData.hire_date ? new Date(formData.hire_date).toISOString() : null,
        is_app_user: formData.is_app_user ? 1 : 0,
        propertyIds: formData.propertyIds,
        primaryPropertyId: formData.primaryPropertyId
      };

      console.log('Submitting employee data:', payload);

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = dialogMode === 'add' 
        ? `${API_URL}/employees` 
        : `${API_URL}/employees/${selectedEmployee.id}`;
      
      const method = dialogMode === 'add' ? 'POST' : 'PUT';

      console.log('Request URL:', url);
      console.log('Request method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to save employee');
      }

      fetchEmployees();
      handleCloseDialog();
      
      setSnackbar({
        open: true,
        message: dialogMode === 'add' ? 'Employee added successfully' : 'Employee updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving employee:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save employee',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/employees/${selectedEmployee.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      fetchEmployees();
      handleCloseDeleteDialog();
      
      setSnackbar({
        open: true,
        message: 'Employee deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete employee',
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

  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    
    if (status === 'all') {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(employees.filter(employee => employee.status === status));
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on_leave':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatSalary = (salary) => {
    return `₹${Number(salary).toLocaleString()}`;
  };

  if (loading || isLoading) {
    return (
      <>
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
      </>
    );
  }


return (
  <>
    <Head>
      <title>Employee Management | Arkedia Homes</title>
      <meta name="description" content="Manage employees at Arkedia Homes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography className={styles.pageTitle} variant="h4" component="h1" gutterBottom>
          Employee Management
        </Typography>
        <Tooltip title="Add Employee" arrow>
          <Button
            className={styles.primaryButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Employee
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Filter by Status"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="on_leave">On Leave</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper className={styles.card} sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table className={styles.table} stickyHeader aria-label="employees table">
            <TableHead className={styles.tableHeader}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Properties</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <React.Fragment key={employee.id}>
                  <TableRow 
                      className={styles.tableRow} 
                      onClick={() => setExpandedEmployees(prev => ({
                        ...prev,
                        [employee.id]: !prev[employee.id]
                      }))}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email || 'N/A'}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.department.charAt(0).toUpperCase() + employee.department.slice(1)}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {employee.properties && employee.properties.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {employee.properties.map((property) => (
                              <Chip 
                                key={property.id} 
                                label={property.name} 
                                size="small" 
                                color={property.EmployeeProperty?.is_primary ? "primary" : "default"}
                                variant={property.EmployeeProperty?.is_primary ? "filled" : "outlined"}
                              />
                            ))}
                          </Box>
                        ) : (
                          'None'
                        )}
                      </TableCell>
                      <TableCell>{formatDate(employee.hire_date)}</TableCell>
                      <TableCell>{formatSalary(employee.salary)}</TableCell>
                      <TableCell>
                        <span 
                          className={`${styles.badge} ${employee.status === 'active' ? styles.badgeSuccess : employee.status === 'on_leave' ? styles.badgeWarning : styles.badgeDanger}`}
                        >
                          {employee.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Employee" arrow>
                          <IconButton
                            className={styles.secondaryButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog('edit', employee);
                            }}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Employee" arrow>
                          <IconButton
                            className={styles.accentButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(employee);
                            }}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expandable row for property details */}
                    {expandedEmployees[employee.id] && employee.properties && employee.properties.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ py: 0 }}>
                          <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Assigned Properties
                            </Typography>
                            <Grid container spacing={2}>
                              {employee.properties.map((property) => (
                                <Grid item xs={12} sm={6} md={4} key={property.id}>
                                  <Paper 
                                    elevation={1} 
                                    sx={{ 
                                      p: 2, 
                                      border: property.EmployeeProperty?.is_primary ? '2px solid #1976d2' : 'none',
                                      position: 'relative'
                                    }}
                                  >
                                    {property.EmployeeProperty?.is_primary && (
                                      <Chip 
                                        label="Primary" 
                                        color="primary" 
                                        size="small" 
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                      />
                                    )}
                                    <Typography variant="subtitle1" component="div">
                                      {property.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Location: {property.location || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Type: {property.property_type || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Total Rooms: {property.total_rooms || 'N/A'}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
        
      

      {/* Add/Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Employee' : 'Edit Employee'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    label="Department"
                    required
                  >
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="housekeeping">Housekeeping</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="management">Management</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="position"
                  label="Position"
                  fullWidth
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="hire_date"
                  label="Hire Date"
                  type="date"
                  fullWidth
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="salary"
                  label="Salary (₹)"
                  type="number"
                  fullWidth
                  value={formData.salary}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="on_leave">On Leave</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emergency_contact"
                  label="Emergency Contact Name"
                  fullWidth
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="emergency_phone"
                  label="Emergency Contact Phone"
                  fullWidth
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      name="is_app_user"
                      checked={formData.is_app_user}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    App User Access
                  </label>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel id="properties-label">Assigned Properties</InputLabel>
                  <Select
                    labelId="properties-label"
                    id="properties"
                    multiple
                    value={formData.propertyIds}
                    onChange={handlePropertyChange}
                    input={<OutlinedInput label="Assigned Properties" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const property = availableProperties.find(p => p.id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={property ? property.name : value} 
                              color={value === formData.primaryPropertyId ? "primary" : "default"}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {availableProperties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        <Checkbox checked={formData.propertyIds.indexOf(property.id) > -1} />
                        <ListItemText primary={property.name} secondary={property.location} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.propertyIds.length > 0 && (
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="primary-property-label">Primary Property</InputLabel>
                    <Select
                      labelId="primary-property-label"
                      id="primary-property"
                      value={formData.primaryPropertyId || ''}
                      onChange={handlePrimaryPropertyChange}
                      label="Primary Property"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {formData.propertyIds.map((propertyId) => {
                        const property = availableProperties.find(p => p.id === propertyId);
                        return (
                          <MenuItem key={propertyId} value={propertyId}>
                            {property ? property.name : propertyId}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Employee' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee {selectedEmployee?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
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
  );}