import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, CircularProgress, Snackbar, Alert, Grid, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function RoomsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPricingDialog, setOpenPricingDialog] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    room_no: '',
    room_type: 'single',
    room_category: 'classic',
    floor: 1,
    area_sqft: 250,
    base_rent: 800,
    is_furnished: false,
    has_ac: false,
    has_balcony: false,
    has_tv: false,
    has_internet: false,
    has_private_bathroom: false,
    description: '',
    status: 'available',
    pricing: {
      shortTerm: '',
      mediumTerm: '',
      longTerm: '',
      withFooding: ''
    }
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch rooms data
        fetchRooms();
      }
    }
  }, [user, loading, router]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockRooms = [
        {
          id: 1,
          room_no: '101',
          room_type: 'single',
          room_category: 'classic',
          floor: 1,
          area_sqft: 250,
          base_rent: 800,
          is_furnished: true,
          has_ac: true,
          has_balcony: false,
          has_tv: true,
          has_internet: true,
          has_private_bathroom: false,
          description: 'Cozy single room with AC and TV',
          status: 'occupied',
          pricing: {
            shortTerm: 'Rs.400/- per Day',
            mediumTerm: 'Rs. 8000/- per month',
            longTerm: 'Rs. 6000/- per month',
            withFooding: 'Rs.9500/- per month per person'
          },
          tenant: {
            name: 'John Doe'
          }
        },
        {
          id: 2,
          room_no: '102',
          room_type: 'double',
          room_category: 'classic',
          floor: 1,
          area_sqft: 350,
          base_rent: 1200,
          is_furnished: true,
          has_ac: true,
          has_balcony: true,
          has_tv: true,
          has_internet: true,
          has_private_bathroom: true,
          description: 'Spacious double room with balcony and private bathroom',
          status: 'available',
          pricing: {
            shortTerm: 'Rs550/- Per Day',
            mediumTerm: 'Rs. 8000/- per month',
            longTerm: 'Rs. 4000/- per month per person',
            withFooding: 'Rs.7500/- per month per person'
          },
          tenant: null
        },
        {
          id: 3,
          room_no: '201',
          room_type: 'single',
          room_category: 'deluxe non-ac',
          floor: 2,
          area_sqft: 450,
          base_rent: 1500,
          is_furnished: true,
          has_ac: false,
          has_balcony: true,
          has_tv: true,
          has_internet: true,
          has_private_bathroom: true,
          description: 'Deluxe room with all amenities and great view',
          status: 'available',
          pricing: {
            shortTerm: 'Rs. 700 Per day',
            mediumTerm: 'Rs. 10000/- per month',
            longTerm: 'Rs. 7500/- per month',
            withFooding: 'Rs.11000/- per month per person'
          },
          tenant: null
        },
        {
          id: 4,
          room_no: '202',
          room_type: 'double',
          room_category: 'deluxe ac',
          floor: 2,
          area_sqft: 550,
          base_rent: 1800,
          is_furnished: true,
          has_ac: true,
          has_balcony: true,
          has_tv: true,
          has_internet: true,
          has_private_bathroom: true,
          description: 'Premium suite with luxury furnishings and panoramic view',
          status: 'occupied',
          pricing: {
            shortTerm: 'Rs 1050 Per Day.',
            mediumTerm: 'Rs. 15000/- per month',
            longTerm: 'Rs. 5500/- per month per person',
            withFooding: 'Rs.9000/- per month per person'
          },
          tenant: {
            name: 'Jane Smith'
          }
        }
      ];
      
      setRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch rooms',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, room = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && room) {
      setSelectedRoom(room);
      setFormData({
        room_no: room.room_no,
        room_type: room.room_type,
        room_category: room.room_category,
        floor: room.floor,
        area_sqft: room.area_sqft,
        base_rent: room.base_rent,
        is_furnished: room.is_furnished,
        has_ac: room.has_ac,
        has_balcony: room.has_balcony,
        has_tv: room.has_tv,
        has_internet: room.has_internet,
        has_private_bathroom: room.has_private_bathroom,
        description: room.description,
        status: room.status,
        pricing: room.pricing || {
          shortTerm: '',
          mediumTerm: '',
          longTerm: '',
          withFooding: ''
        }
      });
    } else {
      // Reset form for add mode
      setFormData({
        room_no: '',
        room_type: 'single',
        room_category: 'classic',
        floor: 1,
        area_sqft: 250,
        base_rent: 800,
        is_furnished: false,
        has_ac: false,
        has_balcony: false,
        has_tv: false,
        has_internet: false,
        has_private_bathroom: false,
        description: '',
        status: 'available',
        pricing: {
          shortTerm: '',
          mediumTerm: '',
          longTerm: '',
          withFooding: ''
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleOpenDeleteDialog = (room) => {
    setSelectedRoom(room);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedRoom(null);
  };

  const handleViewPricing = (room) => {
    setPricingDetails({
      roomNo: room.room_no,
      roomType: room.room_type,
      roomCategory: room.room_category,
      pricing: room.pricing
    });
    setOpenPricingDialog(true);
  };

  const handleClosePricingDialog = () => {
    setOpenPricingDialog(false);
    setPricingDetails(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      // In a real application, this would be an API call
      if (dialogMode === 'add') {
        // Add new room
        const newRoom = {
          id: rooms.length + 1,
          ...formData,
          tenant: null
        };
        setRooms([...rooms, newRoom]);
        setSnackbar({
          open: true,
          message: 'Room added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing room
        const updatedRooms = rooms.map(room => 
          room.id === selectedRoom.id ? { ...room, ...formData } : room
        );
        setRooms(updatedRooms);
        setSnackbar({
          open: true,
          message: 'Room updated successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving room:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save room',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      // In a real application, this would be an API call
      const updatedRooms = rooms.filter(room => room.id !== selectedRoom.id);
      setRooms(updatedRooms);
      setSnackbar({
        open: true,
        message: 'Room deleted successfully',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting room:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete room',
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
        <title>Rooms Management | Arkedia Homes</title>
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
              Rooms Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Room
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room No</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell>Area (sq.ft)</TableCell>
                  <TableCell>Base Rent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.room_no}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{room.room_type}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{room.room_category}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.area_sqft}</TableCell>
                    <TableCell>₹{room.base_rent}</TableCell>
                    <TableCell>
                      <Chip
                        label={room.status}
                        color={room.status === 'available' ? 'success' : 'primary'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{room.tenant ? room.tenant.name : 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog('edit', room)}
                        title="Edit Room"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="info"
                        onClick={() => handleViewPricing(room)}
                        title="View Pricing"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(room)}
                        disabled={room.status === 'occupied'}
                        title="Delete Room"
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

      {/* Add/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
                <FormControl fullWidth>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleInputChange}
                    label="Room Type"
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Room Category</InputLabel>
                  <Select
                    name="room_category"
                    value={formData.room_category}
                    onChange={handleInputChange}
                    label="Room Category"
                  >
                    <MenuItem value="classic">Classic</MenuItem>
                    <MenuItem value="deluxe non-ac">Deluxe Non-AC</MenuItem>
                    <MenuItem value="deluxe ac">Deluxe AC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="floor"
                  label="Floor"
                  type="number"
                  fullWidth
                  value={formData.floor}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="area_sqft"
                  label="Area (sq.ft)"
                  type="number"
                  fullWidth
                  value={formData.area_sqft}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 100 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="base_rent"
                  label="Base Rent (₹)"
                  type="number"
                  fullWidth
                  value={formData.base_rent}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
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
                    disabled={dialogMode === 'edit' && selectedRoom?.tenant}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="reserved">Reserved</MenuItem>
                    {dialogMode === 'edit' && selectedRoom?.tenant && (
                      <MenuItem value="occupied">Occupied</MenuItem>
                    )}
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
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Pricing Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="pricing.shortTerm"
                      label="Short Term Price (< 1 month)"
                      fullWidth
                      value={formData.pricing.shortTerm}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            shortTerm: e.target.value
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="pricing.mediumTerm"
                      label="Medium Term Price (1-4 months)"
                      fullWidth
                      value={formData.pricing.mediumTerm}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            mediumTerm: e.target.value
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="pricing.longTerm"
                      label="Long Term Price (5+ months)"
                      fullWidth
                      value={formData.pricing.longTerm}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            longTerm: e.target.value
                          }
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="pricing.withFooding"
                      label="Price with Fooding (5+ months)"
                      fullWidth
                      value={formData.pricing.withFooding}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            withFooding: e.target.value
                          }
                        });
                      }}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Features
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="is_furnished"
                          checked={formData.is_furnished}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="Furnished"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="has_ac"
                          checked={formData.has_ac}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="AC"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="has_balcony"
                          checked={formData.has_balcony}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="Balcony"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="has_tv"
                          checked={formData.has_tv}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="TV"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="has_internet"
                          checked={formData.has_internet}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="Internet"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="has_private_bathroom"
                          checked={formData.has_private_bathroom}
                          onChange={handleInputChange}
                          color="primary"
                        />
                      }
                      label="Private Bathroom"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Add Room' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete room {selectedRoom?.room_no}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pricing Details Dialog */}
      <Dialog open={openPricingDialog} onClose={handleClosePricingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Pricing Details - Room {pricingDetails?.roomNo}
        </DialogTitle>
        <DialogContent>
          {pricingDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Room Type:</strong> {pricingDetails.roomType.charAt(0).toUpperCase() + pricingDetails.roomType.slice(1)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Room Category:</strong> {pricingDetails.roomCategory.charAt(0).toUpperCase() + pricingDetails.roomCategory.slice(1)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Pricing Structure
              </Typography>
              
              <List>
                <ListItem divider>
                  <ListItemText 
                    primary="Short Term (Less than 1 month)" 
                    secondary={pricingDetails.pricing.shortTerm} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Medium Term (1-4 months)" 
                    secondary={pricingDetails.pricing.mediumTerm} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Long Term (5+ months)" 
                    secondary={pricingDetails.pricing.longTerm} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="With Fooding (5+ months)" 
                    secondary={pricingDetails.pricing.withFooding} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                    secondaryTypographyProps={{ color: 'primary', fontWeight: 'bold' }}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePricingDialog}>Close</Button>
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