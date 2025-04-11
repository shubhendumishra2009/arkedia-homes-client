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

export default function TenantsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedTenant, setSelectedTenant] = useState(null);
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
    room_no: '',
    rent_amount: 0,
    security_deposit: 0,
    lease_start: '',
    lease_end: '',
    payment_due_day: 5,
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
        // Fetch tenants data
        fetchTenants();
      }
    }
  }, [user, loading, router]);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockTenants = [
        {
          id: 1,
          user: {
            id: 101,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '555-123-4567'
          },
          room_no: '101',
          rent_amount: 800,
          security_deposit: 800,
          lease_start: '2023-01-01',
          lease_end: '2023-12-31',
          payment_due_day: 5,
          status: 'active',
          notes: 'Long-term tenant'
        },
        {
          id: 2,
          user: {
            id: 102,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '555-987-6543'
          },
          room_no: '202',
          rent_amount: 1800,
          security_deposit: 1800,
          lease_start: '2023-03-15',
          lease_end: '2024-03-14',
          payment_due_day: 10,
          status: 'active',
          notes: 'Premium suite tenant'
        },
        {
          id: 3,
          user: {
            id: 103,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '555-456-7890'
          },
          room_no: '305',
          rent_amount: 1200,
          security_deposit: 1200,
          lease_start: '2023-06-01',
          lease_end: '2023-11-30',
          payment_due_day: 5,
          status: 'notice_given',
          notes: 'Moving out at end of lease'
        },
        {
          id: 4,
          user: {
            id: 104,
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            phone: '555-789-0123'
          },
          room_no: '410',
          rent_amount: 1500,
          security_deposit: 1500,
          lease_start: '2023-02-15',
          lease_end: '2024-02-14',
          payment_due_day: 1,
          status: 'active',
          notes: ''
        }
      ];
      
      setTenants(mockTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch tenants',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, tenant = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && tenant) {
      setSelectedTenant(tenant);
      setFormData({
        name: tenant.user.name,
        email: tenant.user.email,
        phone: tenant.user.phone,
        room_no: tenant.room_no,
        rent_amount: tenant.rent_amount,
        security_deposit: tenant.security_deposit,
        lease_start: tenant.lease_start,
        lease_end: tenant.lease_end,
        payment_due_day: tenant.payment_due_day,
        status: tenant.status,
        notes: tenant.notes
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        room_no: '',
        rent_amount: 0,
        security_deposit: 0,
        lease_start: '',
        lease_end: '',
        payment_due_day: 5,
        status: 'active',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTenant(null);
  };

  const handleOpenDeleteDialog = (tenant) => {
    setSelectedTenant(tenant);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTenant(null);
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
        // Add new tenant
        const newTenant = {
          id: tenants.length + 1,
          user: {
            id: 100 + tenants.length + 1,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          room_no: formData.room_no,
          rent_amount: formData.rent_amount,
          security_deposit: formData.security_deposit,
          lease_start: formData.lease_start,
          lease_end: formData.lease_end,
          payment_due_day: formData.payment_due_day,
          status: formData.status,
          notes: formData.notes
        };
        setTenants([...tenants, newTenant]);
        setSnackbar({
          open: true,
          message: 'Tenant added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing tenant
        const updatedTenants = tenants.map(tenant => 
          tenant.id === selectedTenant.id ? {
            ...tenant,
            user: {
              ...tenant.user,
              name: formData.name,
              email: formData.email,
              phone: formData.phone
            },
            room_no: formData.room_no,
            rent_amount: formData.rent_amount,
            security_deposit: formData.security_deposit,
            lease_start: formData.lease_start,
            lease_end: formData.lease_end,
            payment_due_day: formData.payment_due_day,
            status: formData.status,
            notes: formData.notes
          } : tenant
        );
        setTenants(updatedTenants);
        setSnackbar({
          open: true,
          message: 'Tenant updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save tenant',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedTenants = tenants.filter(tenant => tenant.id !== selectedTenant.id);
      setTenants(updatedTenants);
      setSnackbar({
        open: true,
        message: 'Tenant deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete tenant',
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
      case 'notice_given':
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
        <title>Tenants Management | Arkedia Homes</title>
        <meta name="description" content="Manage tenants at Arkedia Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography className={styles.pageTitle} variant="h4" component="h1" gutterBottom>
            Tenants Management
          </Typography>
          <Button
            className={styles.primaryButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Tenant
          </Button>
        </Box>

          <Paper className={styles.card} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table className={styles.table} stickyHeader aria-label="tenants table">
                <TableHead className={styles.tableHeader}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Rent</TableCell>
                    <TableCell>Lease Period</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {tenants.map((tenant) => (
                  <TableRow className={styles.tableRow} key={tenant.id}>
                    <TableCell>{tenant.user.name}</TableCell>
                    <TableCell>{tenant.user.email}</TableCell>
                    <TableCell>{tenant.user.phone}</TableCell>
                    <TableCell>{tenant.room_no}</TableCell>
                    <TableCell>₹{tenant.rent_amount}/month</TableCell>
                    <TableCell>
                      {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`${styles.badge} ${tenant.status === 'active' ? styles.badgeSuccess : tenant.status === 'notice_given' ? styles.badgeWarning : styles.badgeDanger}`}
                      >
                        {tenant.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        className={styles.secondaryButton}
                        onClick={() => handleOpenDialog('edit', tenant)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        className={styles.accentButton}
                        onClick={() => handleOpenDeleteDialog(tenant)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Paper>
        </Container>
      

      {/* Add/Edit Tenant Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Tenant' : 'Edit Tenant'}</DialogTitle>
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
                  required
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
                <TextField
                  name="room_no"
                  label="Room Number"
                  fullWidth
                  value={formData.room_no}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rent_amount"
                  label="Rent Amount (₹)"
                  type="number"
                  fullWidth
                  value={formData.rent_amount}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="security_deposit"
                  label="Security Deposit (₹)"
                  type="number"
                  fullWidth
                  value={formData.security_deposit}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lease_start"
                  label="Lease Start Date"
                  type="date"
                  fullWidth
                  value={formData.lease_start}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lease_end"
                  label="Lease End Date"
                  type="date"
                  fullWidth
                  value={formData.lease_end}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="payment_due_day"
                  label="Payment Due Day"
                  type="number"
                  fullWidth
                  value={formData.payment_due_day}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
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
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="notice_given">Notice Given</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
            {dialogMode === 'add' ? 'Add Tenant' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete tenant {selectedTenant?.user?.name}? This action cannot be undone.
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
  );
}