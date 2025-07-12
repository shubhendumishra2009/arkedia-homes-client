import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';
import axios from 'axios';

export default function VendorManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    service_type: 'other',
    payment_terms: '',
    bank_account_details: '',
    tax_id: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch vendors data
        fetchVendors();
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Apply filters whenever vendors, statusFilter, or serviceTypeFilter changes
    if (vendors.length > 0) {
      let filtered = [...vendors];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(vendor => vendor.status === statusFilter);
      }
      
      // Apply service type filter
      if (serviceTypeFilter !== 'all') {
        filtered = filtered.filter(vendor => vendor.service_type === serviceTypeFilter);
      }
      
      setFilteredVendors(filtered);
    }
  }, [vendors, statusFilter, serviceTypeFilter]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${API_URL}/vendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setVendors(response.data.data);
      setFilteredVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch vendors',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, vendor = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && vendor) {
      setSelectedVendor(vendor);
      setFormData({
        name: vendor.name,
        contact_person: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone,
        address: vendor.address || '',
        service_type: vendor.service_type,
        payment_terms: vendor.payment_terms || '',
        bank_account_details: vendor.bank_account_details || '',
        tax_id: vendor.tax_id || '',
        status: vendor.status,
        notes: vendor.notes || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        service_type: 'other',
        payment_terms: '',
        bank_account_details: '',
        tax_id: '',
        status: 'active',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVendor(null);
  };

  const handleOpenDeleteDialog = (vendor) => {
    setSelectedVendor(vendor);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedVendor(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      // Ensure all required fields are present
      if (!formData.name || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = dialogMode === 'add' 
        ? `${API_URL}/vendors` 
        : `${API_URL}/vendors/${selectedVendor.id}`;
      
      const method = dialogMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save vendor');
      }

      fetchVendors();
      handleCloseDialog();
      
      setSnackbar({
        open: true,
        message: dialogMode === 'add' ? 'Vendor added successfully' : 'Vendor updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving vendor:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred while saving vendor',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/vendors/${selectedVendor.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete vendor');
      }

      fetchVendors();
      handleCloseDeleteDialog();
      
      setSnackbar({
        open: true,
        message: 'Vendor deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred while deleting vendor',
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

  const getServiceTypeLabel = (type) => {
    const types = {
      'maintenance': 'Maintenance',
      'supplies': 'Supplies',
      'electronics': 'Electronics',
      'furniture': 'Furniture',
      'cleaning': 'Cleaning',
      'food': 'Food',
      'other': 'Other'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      'active': 'Active',
      'inactive': 'Inactive',
      'blacklisted': 'Blacklisted'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#4caf50',
      'inactive': '#ff9800',
      'blacklisted': '#f44336'
    };
    return colors[status] || '#757575';
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Vendor Management - Arkedia Homes</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography className={styles.pageTitle} variant="h4" component="h1" gutterBottom>
            Vendor Management
          </Typography>
          <Button
            className={styles.primaryButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Vendor
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="blacklisted">Blacklisted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="service-type-filter-label">Filter by Service Type</InputLabel>
                <Select
                  labelId="service-type-filter-label"
                  id="service-type-filter"
                  value={serviceTypeFilter}
                  label="Filter by Service Type"
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="supplies">Supplies</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Paper className={styles.card} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table className={styles.table} stickyHeader aria-label="vendors table">
              <TableHead className={styles.tableHeader}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Service Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1">No vendors found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow className={styles.tableRow} key={vendor.id}>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>{vendor.contact_person || '-'}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>{vendor.email || '-'}</TableCell>
                      <TableCell>{getServiceTypeLabel(vendor.service_type)}</TableCell>
                      <TableCell>
                        <span 
                          className={`${styles.badge} ${vendor.status === 'active' ? styles.badgeSuccess : vendor.status === 'inactive' ? styles.badgeWarning : styles.badgeDanger}`}
                        >
                          {vendor.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          className={styles.secondaryButton}
                          onClick={() => handleOpenDialog('edit', vendor)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          className={styles.accentButton}
                          onClick={() => handleOpenDeleteDialog(vendor)}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        

        {/* Add/Edit Vendor Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? 'Add New Vendor' : 'Edit Vendor'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Vendor Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contact_person"
                  label="Contact Person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    label="Service Type"
                  >
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="supplies">Supplies</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="food">Food</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="blacklisted">Blacklisted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="payment_terms"
                  label="Payment Terms"
                  value={formData.payment_terms}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="tax_id"
                  label="Tax ID"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="bank_account_details"
                  label="Bank Account Details"
                  value={formData.bank_account_details}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {dialogMode === 'add' ? 'Add Vendor' : 'Update Vendor'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete vendor "{selectedVendor?.name}"? This action cannot be undone.
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
    </>
  );
}