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

export default function GroceriesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [groceries, setGroceries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedGrocery, setSelectedGrocery] = useState(null);
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
    stock: 0,
    category: 'dairy',
    unit: 'piece',
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
        // Fetch groceries data
        fetchGroceries();
      }
    }
  }, [user, loading, router]);

  const fetchGroceries = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockGroceries = [
        {
          id: 1,
          name: 'Milk',
          description: 'Fresh whole milk, 1 liter',
          price: 60,
          stock: 24,
          category: 'dairy',
          unit: 'liter',
          is_available: true,
          image_url: '/assets/groceries/milk.jpg'
        },
        {
          id: 2,
          name: 'Bread',
          description: 'Whole wheat bread, 400g',
          price: 40,
          stock: 15,
          category: 'bakery',
          unit: 'loaf',
          is_available: true,
          image_url: '/assets/groceries/bread.jpg'
        },
        {
          id: 3,
          name: 'Eggs',
          description: 'Farm fresh eggs',
          price: 80,
          stock: 30,
          category: 'dairy',
          unit: 'dozen',
          is_available: true,
          image_url: '/assets/groceries/eggs.jpg'
        },
        {
          id: 4,
          name: 'Rice',
          description: 'Basmati rice, premium quality',
          price: 120,
          stock: 10,
          category: 'grains',
          unit: 'kg',
          is_available: true,
          image_url: '/assets/groceries/rice.jpg'
        },
        {
          id: 5,
          name: 'Apples',
          description: 'Fresh red apples',
          price: 30,
          stock: 0,
          category: 'fruits',
          unit: 'piece',
          is_available: false,
          image_url: '/assets/groceries/apples.jpg'
        }
      ];
      
      setGroceries(mockGroceries);
    } catch (error) {
      console.error('Error fetching groceries:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch groceries',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, grocery = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && grocery) {
      setSelectedGrocery(grocery);
      setFormData({
        name: grocery.name,
        description: grocery.description,
        price: grocery.price,
        stock: grocery.stock,
        category: grocery.category,
        unit: grocery.unit,
        is_available: grocery.is_available,
        image_url: grocery.image_url
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'dairy',
        unit: 'piece',
        is_available: true,
        image_url: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGrocery(null);
  };

  const handleOpenDeleteDialog = (grocery) => {
    setSelectedGrocery(grocery);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedGrocery(null);
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
        // Add new grocery
        const newGrocery = {
          id: groceries.length + 1,
          ...formData
        };
        setGroceries([...groceries, newGrocery]);
        setSnackbar({
          open: true,
          message: 'Grocery item added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing grocery
        const updatedGroceries = groceries.map(grocery => 
          grocery.id === selectedGrocery.id ? {
            ...grocery,
            ...formData
          } : grocery
        );
        setGroceries(updatedGroceries);
        setSnackbar({
          open: true,
          message: 'Grocery item updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving grocery item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save grocery item',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedGroceries = groceries.filter(grocery => grocery.id !== selectedGrocery.id);
      setGroceries(updatedGroceries);
      setSnackbar({
        open: true,
        message: 'Grocery item deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting grocery item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete grocery item',
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
      'dairy': 'Dairy',
      'bakery': 'Bakery',
      'fruits': 'Fruits',
      'vegetables': 'Vegetables',
      'grains': 'Grains',
      'snacks': 'Snacks',
      'beverages': 'Beverages',
      'other': 'Other'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'dairy': 'primary',
      'bakery': 'secondary',
      'fruits': 'success',
      'vegetables': 'info',
      'grains': 'warning',
      'snacks': 'error',
      'beverages': 'default',
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
        <title>Groceries Management | Arkedia Homes</title>
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
              Groceries Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Grocery Item
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
                  <TableCell>Stock</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groceries.map((grocery) => (
                  <TableRow key={grocery.id}>
                    <TableCell>{grocery.name}</TableCell>
                    <TableCell>{grocery.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getCategoryLabel(grocery.category)} 
                        color={getCategoryColor(grocery.category)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>₹{grocery.price}</TableCell>
                    <TableCell>{grocery.stock} {grocery.unit}</TableCell>
                    <TableCell>{grocery.unit}</TableCell>
                    <TableCell>
                      <Chip
                        label={grocery.is_available ? (grocery.stock > 0 ? 'In Stock' : 'Out of Stock') : 'Unavailable'}
                        color={grocery.is_available ? (grocery.stock > 0 ? 'success' : 'warning') : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', grocery)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(grocery)}
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

      {/* Add/Edit Grocery Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Grocery Item' : 'Edit Grocery Item'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Item Name"
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
                    <MenuItem value="dairy">Dairy</MenuItem>
                    <MenuItem value="bakery">Bakery</MenuItem>
                    <MenuItem value="fruits">Fruits</MenuItem>
                    <MenuItem value="vegetables">Vegetables</MenuItem>
                    <MenuItem value="grains">Grains</MenuItem>
                    <MenuItem value="snacks">Snacks</MenuItem>
                    <MenuItem value="beverages">Beverages</MenuItem>
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
                  rows={2}
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
                  name="stock"
                  label="Stock Quantity"
                  type="number"
                  fullWidth
                  value={formData.stock}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    label="Unit"
                  >
                    <MenuItem value="piece">Piece</MenuItem>
                    <MenuItem value="kg">Kilogram</MenuItem>
                    <MenuItem value="gram">Gram</MenuItem>
                    <MenuItem value="liter">Liter</MenuItem>
                    <MenuItem value="ml">Milliliter</MenuItem>
                    <MenuItem value="dozen">Dozen</MenuItem>
                    <MenuItem value="pack">Pack</MenuItem>
                    <MenuItem value="loaf">Loaf</MenuItem>
                    <MenuItem value="box">Box</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="image_url"
                  label="Image URL"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                  helperText="Path to the item image"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_available}
                      onChange={handleSwitchChange}
                      name="is_available"
                      color="primary"
                    />
                  }
                  label="Available for ordering"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Item' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the grocery item "{selectedGrocery?.name}"? This action cannot be undone.
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