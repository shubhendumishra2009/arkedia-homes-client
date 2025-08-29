import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import PermissionGuard from '@/components/PermissionGuard';
import styles from '@/styles/Admin.module.css';
import axios from 'axios';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTenants, setExpandedTenants] = useState({});
  
  // Additional state for properties and rooms
  const [properties, setProperties] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [propertySelected, setPropertySelected] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_id: '',
    room_id: '',
    rent_amount: 0,
    security_deposit: 0,
    lease_start: '',
    lease_end: '',
    payment_due_day: 5,
    status: 'active',
    notes: '',
    rooms: []
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch tenants data and properties
        fetchTenants();
        fetchProperties();
      }
    }
  }, [user, loading, router]);
  
  // Fetch available rooms when property is selected
  useEffect(() => {
    if (selectedProperty) {
      fetchRoomsByProperty(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      const response = await axios.get(`${API_URL}/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setProperties(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch properties: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  const fetchRoomsByProperty = async (propertyId) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      // Fetch all rooms and filter by property and availability
      const response = await axios.get(`${API_URL}/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Filter rooms by property and availability
        const rooms = response.data.data.filter(room => 
          room.property_id === parseInt(propertyId) && 
          (room.status === 'available' || (selectedTenant && selectedTenant.room_id === room.id))
        );
        setAvailableRooms(rooms);
      } else {
        throw new Error(response.data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch rooms: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      const response = await axios.get(`${API_URL}/tenants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setTenants(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tenants');
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch tenants: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, tenant = null) => {
    setDialogMode(mode);
    setPropertySelected(false);
    setSelectedProperty('');
    setAvailableRooms([]);
    
    if (mode === 'edit' && tenant) {
      setSelectedTenant(tenant);
      
      // For edit mode, we need to fetch the property and room details
      const formDataObj = {
        name: tenant.user.name,
        email: tenant.user.email,
        phone: tenant.user.phone,
        property_id: '',  // Will be set after fetching room details
        payment_due_day: tenant.payment_due_day,
        status: tenant.status,
        notes: tenant.notes,
        rooms: []
      };
      
      // If tenant has active leases, add them to the rooms array
      if (tenant.leases && tenant.leases.length > 0) {
        formDataObj.rooms = tenant.leases.map(lease => ({
          id: lease.id,
          property_id: lease.property_id,
          room_id: lease.room_id,
          room_no: lease.room ? lease.room.room_no : '',
          rent_amount: lease.rent_amount,
          lease_start: lease.lease_start_date,
          lease_end: lease.lease_end_date
        }));
      }
      
      // If tenant has rooms with property_id, fetch available rooms for that property
      if (formDataObj.rooms && formDataObj.rooms.length > 0 && formDataObj.rooms[0].property_id) {
        const propertyId = formDataObj.rooms[0].property_id;
        formDataObj.property_id = propertyId;
        setSelectedProperty(propertyId);
        setPropertySelected(true);
        
        // Fetch available rooms for this property
        fetchRoomsByProperty(propertyId);
      }
      
      setFormData(formDataObj);
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        property_id: '',
        room_id: '',
        rent_amount: 0,
        security_deposit: 0,
        lease_start: '',
        lease_end: '',
        payment_due_day: 5,
        status: 'active',
        notes: '',
        rooms: []
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
    
    if (name === 'property_id') {
      setSelectedProperty(value);
      setPropertySelected(value !== '');
      setFormData({
        ...formData,
        [name]: value,
        room_id: '' // Reset room selection when property changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddRoomAssignment = () => {
    // Add a new empty room assignment to the rooms array
    setFormData({
      ...formData,
      rooms: [
        ...formData.rooms || [],
        {
          id: Date.now(), // Use timestamp as temporary ID
          property_id: '',
          room_id: '',
          room_no: '',
          rent_amount: 0,
          lease_start: '',
          lease_end: ''
        }
      ]
    });
  };

  const handleRoomInputChange = (index, field, value) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value
    };
    
    // If property is selected, fetch rooms for this property
    if (field === 'property_id' && value) {
      fetchRoomsByProperty(value);
    }
    
    // If room is selected, update room details
    if (field === 'room_id' && value) {
      const selectedRoom = availableRooms.find(room => room.id === parseInt(value));
      if (selectedRoom) {
        updatedRooms[index] = {
          ...updatedRooms[index],
          room_no: selectedRoom.room_no,
          rent_amount: selectedRoom.base_rent
        };
      }
    }
    
    setFormData({
      ...formData,
      rooms: updatedRooms
    });
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms.splice(index, 1);
    
    // When removing a room, explicitly set room_id to null
    setFormData({
      ...formData,
      rooms: updatedRooms,
      room_id: null // Explicitly set to null when removing room
    });
  };

  const handleSubmit = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      // Prepare the tenant data (no room/lease info)
      const tenantData = {
        user_id: formData.user_id || null,  // For existing user
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        payment_due_day: formData.payment_due_day,
        status: formData.status,
        notes: formData.notes
      };

      if (dialogMode === 'add') {
        // Create tenant (no room/lease data)
        const response = await axios.post(`${API_URL}/tenants`, tenantData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create tenant');
        }

        const tenantId = response.data.data.id;

        // If there are room assignments, assign them now via /assign-leases
        if (formData.rooms && formData.rooms.length > 0) {
          const leases = formData.rooms.map(room => ({
            room_id: room.room_id,
            property_id: room.property_id,
            lease_start_date: room.lease_start,
            lease_end_date: room.lease_end,
            rent_amount: room.rent_amount,
            security_deposit: room.security_deposit,
            payment_due_day: formData.payment_due_day,
            status: 'active',
            notes: room.notes || ''
          }));
          const leaseRes = await axios.post(`${API_URL}/tenants/assign-leases`, {
            tenant_id: tenantId,
            leases
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!leaseRes.data.success) {
            throw new Error(leaseRes.data.message || 'Failed to assign leases');
          }
        }

        fetchTenants();
        setSnackbar({
          open: true,
          message: 'Tenant created successfully',
          severity: 'success'
        });
      } else if (dialogMode === 'edit') {
        // Existing logic for tenant update (can be further refactored)
        // ...
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save tenant: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/tenants/${selectedTenant.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete tenant');
      }

      fetchTenants();
      handleCloseDeleteDialog();
      
      setSnackbar({
        open: true,
        message: 'Tenant deleted successfully',
        severity: 'success'
      });
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

  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
  };
  
  // Filter tenants based on status
  const filteredTenants = statusFilter === 'all' 
    ? tenants 
    : tenants.filter(tenant => tenant.status === statusFilter);

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

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString()}`;
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
            Tenant Management
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
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
                  <TableCell>Rent Amount</TableCell>
                  <TableCell>Lease Period</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <React.Fragment key={tenant.id}>
                    <TableRow 
                      className={styles.tableRow} 
                      onClick={() => setExpandedTenants(prev => ({
                        ...prev,
                        [tenant.id]: !prev[tenant.id]
                      }))}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{tenant.user.name}</TableCell>
                      <TableCell>{tenant.user.email || 'N/A'}</TableCell>
                      <TableCell>{tenant.user.phone}</TableCell>
                      <TableCell>
                        {tenant.leases && tenant.leases[0] && tenant.leases[0].room 
                          ? tenant.leases[0].room.room_no 
                          : 'No Room'}
                      </TableCell>
                      <TableCell>
                        {tenant.leases && tenant.leases[0] 
                          ? formatCurrency(tenant.leases[0].rent_amount) 
                          : '0'}/month
                      </TableCell>
                      <TableCell>
                        {tenant.leases && tenant.leases[0] 
                          ? `${formatDate(tenant.leases[0].lease_start_date)} - ${formatDate(tenant.leases[0].lease_end_date)}`
                          : 'No active lease'
                        }
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`${styles.badge} ${tenant.status === 'active' ? styles.badgeSuccess : tenant.status === 'notice_given' ? styles.badgeWarning : styles.badgeDanger}`}
                        >
                          {tenant.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <PermissionGuard requireUpdate={true} pageUrl="/admin/tenants">
                          <IconButton
                            className={styles.secondaryButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog('edit', tenant);
                            }}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </PermissionGuard>
                        <PermissionGuard requireDelete={true} pageUrl="/admin/tenants">
                          <IconButton
                            className={styles.accentButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(tenant);
                            }}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </PermissionGuard>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Payment Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Payment Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="security_deposit"
                  label="Security Deposit (₹)"
                  type="number"
                  value={formData.security_deposit}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="payment_due_day"
                  label="Payment Due Day"
                  type="number"
                  value={formData.payment_due_day}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>Room Assignments</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />} 
                    onClick={handleAddRoomAssignment}
                    size="small"
                  >
                    Add Room
                  </Button>
                </Box>
              </Grid>
              
              {formData.rooms && formData.rooms.map((room, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth required>
                          <InputLabel id={`property-label-${index}`}>Property</InputLabel>
                          <Select
                            labelId={`property-label-${index}`}
                            id={`property-${index}`}
                            value={room.property_id || ''}
                            label="Property"
                            onChange={(e) => {
                              handleRoomInputChange(index, 'property_id', e.target.value);
                            }}
                          >
                            <MenuItem value="">Select a property</MenuItem>
                            {properties.map((property) => (
                              <MenuItem key={property.id} value={property.id}>
                                {property.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth required disabled={!room.property_id}>
                          <InputLabel id={`room-label-${index}`}>Room</InputLabel>
                          <Select
                            labelId={`room-label-${index}`}
                            id={`room-${index}`}
                            value={room.room_id || ''}
                            label="Room"
                            onChange={(e) => {
                              handleRoomInputChange(index, 'room_id', e.target.value);
                            }}
                          >
                            <MenuItem value="">Select a room</MenuItem>
                            {availableRooms
                              .filter(r => r.property_id === parseInt(room.property_id))
                              .map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                  {r.room_no} - {r.room_type} ({formatCurrency(r.base_rent)})
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Rent Amount (₹)"
                          type="number"
                          value={room.rent_amount}
                          onChange={(e) => handleRoomInputChange(index, 'rent_amount', e.target.value)}
                          fullWidth
                          required
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Lease Start"
                          type="date"
                          value={room.lease_start}
                          onChange={(e) => handleRoomInputChange(index, 'lease_start', e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Lease End"
                          type="date"
                          value={room.lease_end}
                          onChange={(e) => handleRoomInputChange(index, 'lease_end', e.target.value)}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleRemoveRoom(index)}
                          fullWidth
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
              
              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Tenant' : 'Update Tenant'}
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