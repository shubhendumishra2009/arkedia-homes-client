import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function EmployeesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'maintenance',
    position: '',
    hire_date: '',
    salary: 0,
    emergency_contact: '',
    emergency_phone: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch employees data
        fetchEmployees();
      }
    }
  }, [user, loading, router]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockEmployees = [
        {
          id: 1,
          user: {
            id: 201,
            name: 'Robert Chen',
            email: 'robert.chen@arkediahomes.com',
            phone: '555-111-2222'
          },
          department: 'maintenance',
          position: 'Maintenance Manager',
          hire_date: '2022-03-15',
          salary: 45000,
          emergency_contact: 'Lisa Chen',
          emergency_phone: '555-222-3333',
          status: 'active',
          notes: 'Experienced in plumbing and electrical work'
        },
        {
          id: 2,
          user: {
            id: 202,
            name: 'Maria Rodriguez',
            email: 'maria.rodriguez@arkediahomes.com',
            phone: '555-333-4444'
          },
          department: 'housekeeping',
          position: 'Head Housekeeper',
          hire_date: '2022-05-10',
          salary: 38000,
          emergency_contact: 'Carlos Rodriguez',
          emergency_phone: '555-444-5555',
          status: 'active',
          notes: 'Manages cleaning staff schedule'
        },
        {
          id: 3,
          user: {
            id: 203,
            name: 'James Wilson',
            email: 'james.wilson@arkediahomes.com',
            phone: '555-555-6666'
          },
          department: 'security',
          position: 'Security Officer',
          hire_date: '2022-07-22',
          salary: 42000,
          emergency_contact: 'Emma Wilson',
          emergency_phone: '555-666-7777',
          status: 'active',
          notes: 'Night shift (10pm-6am)'
        },
        {
          id: 4,
          user: {
            id: 204,
            name: 'Priya Patel',
            email: 'priya.patel@arkediahomes.com',
            phone: '555-777-8888'
          },
          department: 'management',
          position: 'Assistant Property Manager',
          hire_date: '2022-01-05',
          salary: 52000,
          emergency_contact: 'Raj Patel',
          emergency_phone: '555-888-9999',
          status: 'on_leave',
          notes: 'On maternity leave until October 2023'
        }
      ];
      
      setEmployees(mockEmployees);
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
      setFormData({
        name: employee.user.name,
        email: employee.user.email,
        phone: employee.user.phone,
        department: employee.department,
        position: employee.position,
        hire_date: employee.hire_date,
        salary: employee.salary,
        emergency_contact: employee.emergency_contact,
        emergency_phone: employee.emergency_phone,
        status: employee.status,
        notes: employee.notes
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'maintenance',
        position: '',
        hire_date: '',
        salary: 0,
        emergency_contact: '',
        emergency_phone: '',
        status: 'active',
        notes: ''
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      // In a real application, this would be an API call
      if (dialogMode === 'add') {
        // Add new employee
        const newEmployee = {
          id: employees.length + 1,
          user: {
            id: 200 + employees.length + 1,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          department: formData.department,
          position: formData.position,
          hire_date: formData.hire_date,
          salary: formData.salary,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
          status: formData.status,
          notes: formData.notes
        };
        setEmployees([...employees, newEmployee]);
        setSnackbar({
          open: true,
          message: 'Employee added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing employee
        const updatedEmployees = employees.map(employee => 
          employee.id === selectedEmployee.id ? {
            ...employee,
            user: {
              ...employee.user,
              name: formData.name,
              email: formData.email,
              phone: formData.phone
            },
            department: formData.department,
            position: formData.position,
            hire_date: formData.hire_date,
            salary: formData.salary,
            emergency_contact: formData.emergency_contact,
            emergency_phone: formData.emergency_phone,
            status: formData.status,
            notes: formData.notes
          } : employee
        );
        setEmployees(updatedEmployees);
        setSnackbar({
          open: true,
          message: 'Employee updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save employee',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedEmployees = employees.filter(employee => employee.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      setSnackbar({
        open: true,
        message: 'Employee deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
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

  const getDepartmentLabel = (department) => {
    switch (department) {
      case 'maintenance':
        return 'Maintenance';
      case 'housekeeping':
        return 'Housekeeping';
      case 'security':
        return 'Security';
      case 'management':
        return 'Management';
      case 'other':
        return 'Other';
      default:
        return department;
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
        <title>Employees Management | Arkedia Homes</title>
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
            <Typography variant="h4">
              Employees Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Employee
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Hire Date</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.user.name}</TableCell>
                    <TableCell>{employee.user.email}</TableCell>
                    <TableCell>{employee.user.phone}</TableCell>
                    <TableCell>{getDepartmentLabel(employee.department)}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{formatDate(employee.hire_date)}</TableCell>
                    <TableCell>₹{employee.salary.toLocaleString()}/year</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status.replace('_', ' ')}
                        color={getStatusChipColor(employee.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog('edit', employee)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(employee)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Employee Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={formData.department}
                      label="Department"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="housekeeping">Housekeeping</MenuItem>
                      <MenuItem value="security">Security</MenuItem>
                      <MenuItem value="management">Management</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hire Date"
                    name="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary (₹/year)"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: '₹',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    name="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="on_leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
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
                Are you sure you want to delete employee: {selectedEmployee?.user.name}?
                This action cannot be undone.
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
        </Container>
      </Box>
    </>
  );
}