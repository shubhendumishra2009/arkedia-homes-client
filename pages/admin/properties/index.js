import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Snackbar, Alert, MenuItem, Chip } from '@mui/material';
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

export default function PropertiesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    description: '',
    property_type: 'apartment',
    total_rooms: 0,
    amenities: [],
    status: 'active'
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch properties data
        fetchProperties();
      }
    }
  }, [user, loading, router]);

  const fetchProperties = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, property = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && property) {
      setSelectedProperty(property);
      setFormData({
        name: property.name,
        location: property.location,
        address: property.address,
        description: property.description || '',
        property_type: property.property_type || 'apartment',
        total_rooms: property.total_rooms || 0,
        amenities: property.amenities || [],
        status: property.status || 'active'
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        location: '',
        address: '',
        description: '',
        property_type: 'apartment',
        total_rooms: 0,
        amenities: [],
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const handleOpenDeleteDialog = (property) => {
    setSelectedProperty(property);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProperty(null);
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      if (dialogMode === 'add') {
        // Add new property
        const response = await axios.post(`${API_URL}/properties`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to add property');
        }
        
        // Refresh properties list
        fetchProperties();
        
        setSnackbar({
          open: true,
          message: 'Property added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing property
        const response = await axios.put(`${API_URL}/properties/${selectedProperty.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update property');
        }
        
        // Refresh properties list
        fetchProperties();
        
        setSnackbar({
          open: true,
          message: 'Property updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save property: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      const response = await axios.delete(`${API_URL}/properties/${selectedProperty.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete property');
      }
      
      // Refresh properties list
      fetchProperties();
      
      setSnackbar({
        open: true,
        message: 'Property deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete property: ' + (error.message || 'Unknown error'),
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
        <title>Properties Management | Arkedia Homes</title>
        <meta name="description" content="Manage properties at Arkedia Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography className={styles.pageTitle} variant="h4" component="h1" gutterBottom>
            Properties Management
          </Typography>
          <PermissionGuard requireAdd={true} pageUrl="/admin/properties">
            <Button
              className={styles.primaryButton}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Property
            </Button>
          </PermissionGuard>
        </Box>

        <Paper className={styles.card} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table className={styles.table} stickyHeader aria-label="properties table">
              <TableHead className={styles.tableHeader}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Total Rooms</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow className={styles.tableRow} key={property.id}>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : 'N/A'}</TableCell>
                    <TableCell>{property.total_rooms || 0}</TableCell>
                    <TableCell>
                      <Chip 
                        label={property.status ? property.status.replace('_', ' ').toUpperCase() : 'ACTIVE'}
                        color={property.status === 'active' ? 'success' : property.status === 'inactive' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell align="right">
                      <PermissionGuard requireUpdate={true} pageUrl="/admin/properties">
                        <IconButton
                          className={styles.secondaryButton}
                          onClick={() => handleOpenDialog('edit', property)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </PermissionGuard>
                      <PermissionGuard requireDelete={true} pageUrl="/admin/properties">
                        <IconButton
                          className={styles.accentButton}
                          onClick={() => handleOpenDeleteDialog(property)}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Add/Edit Property Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Property' : 'Edit Property'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Property Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="location"
                  label="Location"
                  fullWidth
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="property_type"
                  label="Property Type"
                  fullWidth
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                  <MenuItem value="hostel">Hostel</MenuItem>
                  <MenuItem value="pg">PG</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="total_rooms"
                  label="Total Rooms"
                  type="number"
                  fullWidth
                  value={formData.total_rooms}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="status"
                  label="Status"
                  fullWidth
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="under_maintenance">Under Maintenance</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Full Address"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Property' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete property "{selectedProperty?.name}"? This action cannot be undone.
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