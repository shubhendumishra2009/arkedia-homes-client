import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert, FormControlLabel, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function AmenitiesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedAmenity, setSelectedAmenity] = useState(null);
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
    is_available: true,
    category: 'gym',
    usage_limit: 'unlimited',
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
        // Fetch amenities data
        fetchAmenities();
      }
    }
  }, [user, loading, router]);

  const fetchAmenities = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockAmenities = [
        {
          id: 1,
          name: 'Swimming Pool',
          description: 'Olympic-sized swimming pool with temperature control',
          price: 0,
          is_available: true,
          category: 'pool',
          usage_limit: 'unlimited',
          image_url: '/assets/amenities/pool.jpg'
        },
        {
          id: 2,
          name: 'Fitness Center',
          description: 'Fully equipped gym with cardio and weight training equipment',
          price: 0,
          is_available: true,
          category: 'gym',
          usage_limit: 'unlimited',
          image_url: '/assets/amenities/gym.jpg'
        },
        {
          id: 3,
          name: 'Sauna',
          description: 'Relaxing sauna with temperature control',
          price: 200,
          is_available: true,
          category: 'wellness',
          usage_limit: '2 hours per day',
          image_url: '/assets/amenities/sauna.jpg'
        },
        {
          id: 4,
          name: 'Conference Room',
          description: 'Fully equipped conference room for meetings and events',
          price: 500,
          is_available: true,
          category: 'business',
          usage_limit: 'reservation required',
          image_url: '/assets/amenities/conference.jpg'
        },
        {
          id: 5,
          name: 'Tennis Court',
          description: 'Professional tennis court with lighting for night play',
          price: 300,
          is_available: false,
          category: 'sports',
          usage_limit: '2 hours per booking',
          image_url: '/assets/amenities/tennis.jpg'
        }
      ];
      
      setAmenities(mockAmenities);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch amenities',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, amenity = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && amenity) {
      setSelectedAmenity(amenity);
      setFormData({
        name: amenity.name,
        description: amenity.description,
        price: amenity.price,
        is_available: amenity.is_available,
        category: amenity.category,
        usage_limit: amenity.usage_limit,
        image_url: amenity.image_url
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        is_available: true,
        category: 'gym',
        usage_limit: 'unlimited',
        image_url: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAmenity(null);
  };

  const handleOpenDeleteDialog = (amenity) => {
    setSelectedAmenity(amenity);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAmenity(null);
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
        // Add new amenity
        const newAmenity = {
          id: amenities.length + 1,
          ...formData
        };
        setAmenities([...amenities, newAmenity]);
        setSnackbar({
          open: true,
          message: 'Amenity added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing amenity
        const updatedAmenities = amenities.map(amenity => 
          amenity.id === selectedAmenity.id ? {
            ...amenity,
            ...formData
          } : amenity
        );
        setAmenities(updatedAmenities);
        setSnackbar({
          open: true,
          message: 'Amenity updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving amenity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save amenity',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedAmenities = amenities.filter(amenity => amenity.id !== selectedAmenity.id);
      setAmenities(updatedAmenities);
      setSnackbar({
        open: true,
        message: 'Amenity deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete amenity',
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
      'gym': 'Fitness',
      'pool': 'Swimming',
      'wellness': 'Wellness',
      'business': 'Business',
      'sports': 'Sports',
      'entertainment': 'Entertainment',
      'other': 'Other'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'gym': 'primary',
      'pool': 'info',
      'wellness': 'success',
      'business': 'secondary',
      'sports': 'warning',
      'entertainment': 'error',
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
        <title>Amenities Management | Arkedia Homes</title>
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
              Amenities Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Amenity
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
                  <TableCell>Usage Limit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amenities.map((amenity) => (
                  <TableRow key={amenity.id}>
                    <TableCell>{amenity.name}</TableCell>
                    <TableCell>{amenity.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getCategoryLabel(amenity.category)} 
                        color={getCategoryColor(amenity.category)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {amenity.price === 0 ? 'Free' : `₹${amenity.price}`}
                    </TableCell>
                    <TableCell>{amenity.usage_limit}</TableCell>
                    <TableCell>
                      <Chip
                        label={amenity.is_available ? 'Available' : 'Unavailable'}
                        color={amenity.is_available ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', amenity)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(amenity)}
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

      {/* Add/Edit Amenity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Amenity' : 'Edit Amenity'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Amenity Name"
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
                    <MenuItem value="gym">Fitness</MenuItem>
                    <MenuItem value="pool">Swimming</MenuItem>
                    <MenuItem value="wellness">Wellness</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
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
                  helperText="Set to 0 for free amenities"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="usage_limit"
                  label="Usage Limit"
                  fullWidth
                  value={formData.usage_limit}
                  onChange={handleInputChange}
                  helperText="E.g., 'unlimited', '2 hours per day', etc."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="image_url"
                  label="Image URL"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                  helperText="Path to the amenity image"
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
            {dialogMode === 'add' ? 'Add Amenity' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the amenity "{selectedAmenity?.name}"? This action cannot be undone.
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