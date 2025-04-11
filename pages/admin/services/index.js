import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert, FormControlLabel, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function ServicesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedService, setSelectedService] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: 'cleaning',
    is_available: true,
    image_url: ''
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch services data
        fetchServices();
      }
    }
  }, [user, loading, router]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockServices = [
        {
          id: 1,
          name: 'Room Cleaning',
          description: 'Complete room cleaning service including dusting, vacuuming, and bathroom cleaning',
          price: 300,
          duration: '1 hour',
          category: 'cleaning',
          is_available: true,
          image_url: '/assets/services/cleaning.jpg'
        },
        {
          id: 2,
          name: 'Laundry Service',
          description: 'Wash, dry, and fold laundry service with quick turnaround',
          price: 200,
          duration: 'Same day',
          category: 'laundry',
          is_available: true,
          image_url: '/assets/services/laundry.jpg'
        },
        {
          id: 3,
          name: 'Meal Delivery',
          description: 'Freshly prepared meals delivered to your room',
          price: 250,
          duration: '30 minutes',
          category: 'food',
          is_available: true,
          image_url: '/assets/services/meal.jpg'
        },
        {
          id: 4,
          name: 'Airport Pickup',
          description: 'Comfortable transportation from the airport to Arkedia Homes',
          price: 800,
          duration: 'As scheduled',
          category: 'transportation',
          is_available: true,
          image_url: '/assets/services/airport.jpg'
        },
        {
          id: 5,
          name: 'Plumbing Repair',
          description: 'Professional plumbing repair service for any issues',
          price: 500,
          duration: 'Varies',
          category: 'maintenance',
          is_available: false,
          image_url: '/assets/services/plumbing.jpg'
        }
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch services',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, service = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && service) {
      setSelectedService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        is_available: service.is_available,
        image_url: service.image_url
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: '',
        category: 'cleaning',
        is_available: true,
        image_url: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  const handleOpenDeleteDialog = (service) => {
    setSelectedService(service);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedService(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      is_available: e.target.checked
    });
  };

  const handleSubmit = async () => {
    try {
      // In a real application, this would be an API call
      if (dialogMode === 'add') {
        // Add new service
        const newService = {
          id: services.length + 1,
          ...formData
        };
        setServices([...services, newService]);
        setSnackbar({
          open: true,
          message: 'Service added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing service
        const updatedServices = services.map(service => 
          service.id === selectedService.id ? {
            ...service,
            ...formData
          } : service
        );
        setServices(updatedServices);
        setSnackbar({
          open: true,
          message: 'Service updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving service:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save service',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedServices = services.filter(service => service.id !== selectedService.id);
      setServices(updatedServices);
      setSnackbar({
        open: true,
        message: 'Service deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting service:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete service',
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

  const getCategoryLabel = (category) => {
    const categories = {
      'cleaning': 'Cleaning',
      'laundry': 'Laundry',
      'food': 'Food & Beverage',
      'transportation': 'Transportation',
      'maintenance': 'Maintenance',
      'security': 'Security',
      'entertainment': 'Entertainment',
      'other': 'Other'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'cleaning': 'primary',
      'laundry': 'secondary',
      'food': 'success',
      'transportation': 'info',
      'maintenance': 'warning',
      'security': 'error',
      'entertainment': 'default',
      'other': 'default'
    };
    return colors[category] || 'default';
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
        <title>Services Management | Arkedia Homes</title>
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
              Services Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Service
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price (₹)</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getCategoryLabel(service.category)} 
                        color={getCategoryColor(service.category)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>₹{service.price}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>
                      <Chip
                        label={service.is_available ? 'Available' : 'Unavailable'}
                        color={service.is_available ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', service)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(service)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Add/Edit Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Service' : 'Edit Service'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Service Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="laundry">Laundry</MenuItem>
                    <MenuItem value="food">Food & Beverage</MenuItem>
                    <MenuItem value="transportation">Transportation</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="entertainment">Entertainment</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
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
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="duration"
                  label="Duration"
                  fullWidth
                  value={formData.duration}
                  onChange={handleInputChange}
                  helperText="E.g., '1 hour', 'Same day', 'As scheduled'"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="image_url"
                  label="Image URL"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                  helperText="Path to the service image"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_available}
                      onChange={handleSwitchChange}
                      name="is_available"
                      color="primary"
                    />
                  }
                  label="Available"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Service' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the service "{selectedService?.name}"? This action cannot be undone.
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