import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, CircularProgress, Snackbar, Alert, Grid, Divider, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { useRouter } from 'next/router';
import RoomFilters from './RoomFilters';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import PermissionGuard from '@/components/PermissionGuard';
import styles from '@/styles/Admin.module.css';
import axios from 'axios';

export default function RoomsManagement() {

  const { user, loading } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState({ property_id: '', room_no: '', status: '' });
  // Track if price fields have been manually edited
  const [pricingEdited, setPricingEdited] = useState({});
  const [mealTariff, setMealTariff] = useState(null);
  const [mealTariffLoading, setMealTariffLoading] = useState(false);

  // Compute available room numbers for the selected property
  const availableRoomNumbers = React.useMemo(() => {
    if (!filter.property_id) return [];
    return rooms.filter(r => r.property_id === filter.property_id).map(r => r.room_no);
  }, [rooms, filter.property_id]);

  // Status options
  const statusOptions = React.useMemo(() => ['available', 'occupied', 'maintenance'], []);

  // Filtered rooms based on filters
  const filteredRooms = React.useMemo(() => {
    return rooms.filter(r => {
      if (filter.property_id && r.property_id !== filter.property_id) return false;
      if (filter.room_no && r.room_no !== filter.room_no) return false;
      if (filter.status && r.status !== filter.status) return false;
      return true;
    });
  }, [rooms, filter]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPricingDialog, setOpenPricingDialog] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [propertySelected, setPropertySelected] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // State for expanded/collapsed pricing info row (only one open at a time)
  const [openRoomRowIdx, setOpenRoomRowIdx] = useState(null);

  const handleToggleRoomRow = (idx) => {
    setOpenRoomRowIdx(prevIdx => (prevIdx === idx ? null : idx));
  };


  // Helper: fetch meal tariff for selected property
  const fetchMealTariff = async (propertyId) => {
    if (!propertyId) {
      setMealTariff(null);
      return;
    }
    setMealTariffLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/meal-tariff-master?property_id=${propertyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setMealTariff(res.data[0]);
      } else {
        setMealTariff(null);
      }
    } catch (e) {
      setMealTariff(null);
    } finally {
      setMealTariffLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    property_id: '',
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
      short_term_price: '',
      medium_term_price: '',
      long_term_price: '',
      short_term_price_with_fooding: '',
      medium_term_price_with_fooding: '',
      long_term_price_with_fooding: '',
      breakfast_only_short_term: '',
      breakfast_only_medium_term: '',
      breakfast_only_long_term: '',
      lunch_only_short_term: '',
      lunch_only_medium_term: '',
      lunch_only_long_term: '',
      dinner_only_short_term: '',
      dinner_only_medium_term: '',
      dinner_only_long_term: '',
      bf_and_dinner_short_term: '',
      bf_and_dinner_medium_term: '',
      bf_and_dinner_long_term: '',
      lunch_and_dinner_short_term: '',
      lunch_and_dinner_medium_term: '',
      lunch_and_dinner_long_term: ''
    }
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch rooms data and properties data
        fetchRooms();
        fetchProperties();
      }
    }
  }, [user, loading, router]);
  
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

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      const response = await axios.get(`${API_URL}/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Transform the data to match our component's expected format
        const fetchedRooms = response.data.data.map(room => ({
          id: room.id,
          property_id: room.property_id,
          room_no: room.room_no,
          room_type: room.room_type,
          room_category: room.room_category || 'classic',
          floor: room.floor,
          area_sqft: room.area_sqft,
          base_rent: room.base_rent,
          is_furnished: room.is_furnished,
          has_ac: room.has_ac,
          has_balcony: room.has_balcony,
          has_tv: room.has_tv || false,
          has_internet: room.has_internet || false,
          has_private_bathroom: room.has_private_bathroom || false,
          description: room.description,
          status: room.status,
          pricing: {
            short_term_price: room.short_term_price ?? '',
            medium_term_price: room.medium_term_price ?? '',
            long_term_price: room.long_term_price ?? '',
            short_term_price_with_fooding: room.short_term_price_with_fooding ?? '',
            medium_term_price_with_fooding: room.medium_term_price_with_fooding ?? '',
            long_term_price_with_fooding: room.long_term_price_with_fooding ?? '',
            breakfast_only_short_term: room.breakfast_only_short_term ?? '',
            breakfast_only_medium_term: room.breakfast_only_medium_term ?? '',
            breakfast_only_long_term: room.breakfast_only_long_term ?? '',
            lunch_only_short_term: room.lunch_only_short_term ?? '',
            lunch_only_medium_term: room.lunch_only_medium_term ?? '',
            lunch_only_long_term: room.lunch_only_long_term ?? '',
            dinner_only_short_term: room.dinner_only_short_term ?? '',
            dinner_only_medium_term: room.dinner_only_medium_term ?? '',
            dinner_only_long_term: room.dinner_only_long_term ?? '',
            bf_and_dinner_short_term: room.bf_and_dinner_short_term ?? '',
            bf_and_dinner_medium_term: room.bf_and_dinner_medium_term ?? '',
            bf_and_dinner_long_term: room.bf_and_dinner_long_term ?? '',
            lunch_and_dinner_short_term: room.lunch_and_dinner_short_term ?? '',
            lunch_and_dinner_medium_term: room.lunch_and_dinner_medium_term ?? '',
            lunch_and_dinner_long_term: room.lunch_and_dinner_long_term ?? ''
          },
          tenant: room.roomTanent ? {
            name: room.roomTanent.name
          } : null
        }));
        
        setRooms(fetchedRooms);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (mode, room = null) => {
    setDialogMode(mode);
    setPropertySelected(false);
    if (mode === 'edit' && room) {
      setSelectedRoom(room);
      setFormData({
        ...room,
        pricing: room.pricing || {}
      });
      setPricingEdited({ shortTerm: false, mediumTerm: false, longTerm: false });
      if (room.property_id) {
        setPropertySelected(true);
      }
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
      setPricingEdited({ shortTerm: false, mediumTerm: false, longTerm: false });
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

  const handleInputChange = (e, section) => {
  const { name, value, checked } = e.target;
  if (section === 'pricing') {
    setPricingEdited(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: value
      }
    }));
    return;
  }
    
    // If property is being selected, enable the form fields
    if (name === 'property_id') {
      setPropertySelected(value !== '');
      setFormData(prev => ({ ...prev, property_id: value }));
      // Fetch meal tariff for selected property
      fetchMealTariff(value);
      // Reset pricingEdited and pricing fields
      setPricingEdited({});
      setFormData(prev => ({
        ...prev,
        pricing: {},
      }));
      return;
    }

    // Handle base_rent change and auto-calculate prices if not edited
    if (name === 'base_rent') {
      const baseRent = Number(value) || 0;
      const meal = mealTariff || {};
      const terms = [
        { label: 'short_term', mult: 1.2 },
        { label: 'medium_term', mult: 1.1 },
        { label: 'long_term', mult: 1 },
      ];
      let newPricing = { ...formData.pricing };
      // Without Fooding
      terms.forEach(term => {
        const key = `${term.label}_price`;
        if (!pricingEdited[key]) {
          newPricing[key] = (baseRent * term.mult).toFixed(0);
        }
      });
      // With Fooding (All Meals)
      terms.forEach(term => {
        const key = `${term.label}_price_with_fooding`;
        const termPriceKey = `${term.label}_price`;
        if (!pricingEdited[key]) {
          const mealSum = Number(meal.breakfast_price || 0) + Number(meal.lunch_price || 0) + Number(meal.dinner_price || 0);
          const termPrice = Number(newPricing[termPriceKey]) || (baseRent * term.mult);
          newPricing[key] = (termPrice + mealSum * 30).toFixed(0);
        }
      });
      // Single meal plans
      const mealPlans = [
        { prefix: 'breakfast_only', tariff: Number(meal.breakfast_price || 0) },
        { prefix: 'lunch_only', tariff: Number(meal.lunch_price || 0) },
        { prefix: 'dinner_only', tariff: Number(meal.dinner_price || 0) },
        { prefix: 'bf_and_dinner', tariff: Number(meal.breakfast_price || 0) + Number(meal.dinner_price || 0) },
        { prefix: 'lunch_and_dinner', tariff: Number(meal.lunch_price || 0) + Number(meal.dinner_price || 0) },
      ];
      mealPlans.forEach(plan => {
        terms.forEach(term => {
          // Map to correct UI key e.g. 'breakfast_only_short_term'
          const key = `${plan.prefix}_${term.label}`;
          const termPriceKey = `${term.label}_price`;
          if (!pricingEdited[key]) {
            // Use the correct key for calculation
            const termPrice = Number(newPricing[termPriceKey]) || (baseRent * term.mult);
            newPricing[key] = (termPrice + plan.tariff * 30).toFixed(0);
          }
        });
      });
      setFormData(prev => ({
        ...prev,
        base_rent: value,
        pricing: newPricing
      }));
      return;
    }

    // Handle pricing fields and mark as edited
    if (name.startsWith('pricing.')) {
      const key = name.split('.')[1];
      setPricingEdited(prev => ({ ...prev, [key]: true }));
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [key]: value
        }
      }));
      return;
    }
    // For new fields (not nested under pricing)
    if (name.endsWith('_term_price') || name.endsWith('_only_short_term') || name.endsWith('_only_medium_term') || name.endsWith('_only_long_term') || name.endsWith('_and_dinner_short_term') || name.endsWith('_and_dinner_medium_term') || name.endsWith('_and_dinner_long_term') || name.endsWith('_fooding_short_term') || name.endsWith('_fooding_medium_term') || name.endsWith('_fooding_long_term')) {
      setPricingEdited(prev => ({ ...prev, [name]: true }));
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    setFormData({
      ...formData,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      
      if (!API_URL) {
        throw new Error('API URL not found');
      }
      
      // Prepare the payload
      const payload = {
        ...formData,
        ...formData.pricing, // flatten all pricing fields to root
        is_furnished: formData.is_furnished ? 1 : 0,
        has_ac: formData.has_ac ? 1 : 0,
        has_balcony: formData.has_balcony ? 1 : 0,
        has_tv: formData.has_tv ? 1 : 0,
        has_internet: formData.has_internet ? 1 : 0,
        has_private_bathroom: formData.has_private_bathroom ? 1 : 0,
        property_id: parseInt(formData.property_id, 10),
      };
      delete payload.pricing; // Remove nested pricing object if present
      
      if (dialogMode === 'add') {
        // Add new room
        const response = await axios.post(`${API_URL}/rooms`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to add room');
        }
        
        setSnackbar({
          open: true,
          message: 'Room added successfully',
          severity: 'success'
        });
      } else {
        // Edit existing room
        const response = await axios.put(`${API_URL}/rooms/${selectedRoom.id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update room');
        }
        
        setSnackbar({
          open: true,
          message: 'Room updated successfully',
          severity: 'success'
        });
      }
      
      // Refresh rooms list
      fetchRooms();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving room:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save room: ' + (error.message || 'Unknown error'),
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
      
      const response = await axios.delete(`${API_URL}/rooms/${selectedRoom.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete room');
      }
      
      // Refresh rooms list
      fetchRooms();
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
        message: 'Failed to delete room: ' + (error.message || 'Unknown error'),
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
        <meta name="description" content="Manage rooms at Arkedia Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <Box>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography className={styles.pageTitle} variant="h4" component="h1" gutterBottom>
                Rooms Management
              </Typography>
              <PermissionGuard requireAdd={true} pageUrl="/admin/rooms">
                <Button
                  className={styles.primaryButton}
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('add')}
                >
                  Add Room
                </Button>
              </PermissionGuard>
            </Box>
            {/* Room Filters */}
          <RoomFilters
            properties={properties}
            filter={filter}
            setFilter={setFilter}
            availableRoomNumbers={availableRoomNumbers}
            statusOptions={statusOptions}
          />
          <Paper className={styles.card} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table className={styles.table} stickyHeader aria-label="rooms table">
               <TableHead className={styles.tableHeader}>
                 <TableRow>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Room No</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Property</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Type</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Category</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Base Rent</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Status</TableCell>
                   <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Actions</TableCell>
                 </TableRow>
               </TableHead>
              <TableBody>
                {filteredRooms.map((room, idx) => (
                  <React.Fragment key={room.id}>
                    <TableRow
                      sx={{ backgroundColor: idx % 2 === 0 ? '#90caf9' : '#1976d2', color: idx % 2 === 0 ? 'inherit' : '#fff', '& td, & th': { color: idx % 2 === 0 ? 'inherit' : '#fff' } }}
                    >
                      <TableCell>
                        <IconButton
                          aria-label={openRoomRowIdx === idx ? 'Collapse' : 'Expand'}
                          size="small"
                          onClick={() => handleToggleRoomRow(idx)}
                          sx={{ mr: 1 }}
                        >
                          {openRoomRowIdx === idx ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        {room.room_no}
                      </TableCell>
                      <TableCell>{properties.find(p => p.id === room.property_id)?.name || 'N/A'}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{room.room_type}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{room.room_category}</TableCell>
                      <TableCell>₹{room.base_rent}</TableCell>
                      
                      <TableCell>
                        <Chip
                          label={room.status ? room.status.replace('_', ' ').toUpperCase() : 'AVAILABLE'}
                          color={
                            room.status === 'available' ? 'success' :
                            room.status === 'occupied' ? 'error' :
                            room.status === 'maintenance' ? 'warning' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <PermissionGuard requireUpdate={true} pageUrl="/admin/rooms">
                          <Tooltip title="Edit Room" arrow>
                            <IconButton
                              className={styles.secondaryButton}
                              onClick={() => handleOpenDialog('edit', room)}
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </PermissionGuard>
                        <PermissionGuard requireDelete={true} pageUrl="/admin/rooms">
                          <Tooltip title="Delete Room" arrow>
                            <IconButton
                              className={styles.accentButton}
                              onClick={() => handleOpenDeleteDialog(room)}
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </PermissionGuard>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                        <Collapse in={openRoomRowIdx === idx} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Typography variant="h6" gutterBottom>Pricing Information</Typography>
                            <Table size="small" sx={{ background: '#f8f8f8', borderRadius: 2, mt: 2 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Meal Plan</TableCell>
                                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Short Term (&lt; 1 month)</TableCell>
                                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Medium Term (1-4 months)</TableCell>
                                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Long Term (5+ months)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Without Fooding</TableCell>
                                  <TableCell>₹{room.pricing?.short_term_price || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.medium_term_price || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.long_term_price || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>With Fooding (All Meals)</TableCell>
                                  <TableCell>₹{room.pricing?.short_term_price_with_fooding || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.medium_term_price_with_fooding || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.long_term_price_with_fooding || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Breakfast Only</TableCell>
                                  <TableCell>₹{room.pricing?.breakfast_only_short_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.breakfast_only_medium_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.breakfast_only_long_term || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Lunch Only</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_only_short_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_only_medium_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_only_long_term || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Dinner Only</TableCell>
                                  <TableCell>₹{room.pricing?.dinner_only_short_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.dinner_only_medium_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.dinner_only_long_term || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>BF and Dinner</TableCell>
                                  <TableCell>₹{room.pricing?.bf_and_dinner_short_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.bf_and_dinner_medium_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.bf_and_dinner_long_term || '-'}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Lunch and Dinner</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_and_dinner_short_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_and_dinner_medium_term || '-'}</TableCell>
                                  <TableCell>₹{room.pricing?.lunch_and_dinner_long_term || '-'}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>

    {/* Add/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Property</InputLabel>
                  <Select
                    name="property_id"
                    value={formData.property_id}
                    onChange={handleInputChange}
                    label="Property"
                  >
                    <MenuItem value="">Select a property</MenuItem>
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name} - {property.location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="room_no"
                  label="Room Number"
                  fullWidth
                  value={formData.room_no}
                  onChange={handleInputChange}
                  required
                  disabled={!propertySelected}
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
                    disabled={!propertySelected}
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
                    disabled={!propertySelected}
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
                  disabled={!propertySelected}
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
                  disabled={!propertySelected}
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
                  disabled={!propertySelected}
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
                    disabled={(dialogMode === 'edit' && selectedRoom?.tenant) || !propertySelected}
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
                  disabled={!propertySelected}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
  Tariff (Meal Plan Pricing)
</Typography>

{/* Without Fooding */}
<Typography variant="subtitle1" sx={{ mt: 2 }}>Without Fooding</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="short_term_price"
      label="Short Term Price (< 1 month)"
      fullWidth
      value={formData.pricing?.short_term_price || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="medium_term_price"
      label="Medium Term Price (1-4 months)"
      fullWidth
       value={formData.pricing?.medium_term_price || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="long_term_price"
      label="Long Term Price (5+ months)"
      fullWidth
       value={formData.pricing?.long_term_price || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
</Grid>

{/* With Fooding (All Meals) */}
<Typography variant="subtitle1" sx={{ mt: 3 }}>With Fooding (All Meals: BF + Lunch + Dinner)</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="short_term_price_with_fooding"
      label="Short Term Price With Fooding (< 1 month)"
      fullWidth
      value={formData.pricing?.short_term_price_with_fooding || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="medium_term_price_with_fooding"
      label="Medium Term Price With Fooding (1-4 months)"
      fullWidth
       value={formData.pricing?.medium_term_price_with_fooding || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="long_term_price_with_fooding"
      label="Long Term Price With Fooding (5+ months)"
      fullWidth
      value={formData.pricing?.long_term_price_with_fooding || ''}
       onChange={e => handleInputChange(e, 'pricing')}
       disabled={!propertySelected}
     />
  </Grid>
</Grid>

{/* With Fooding: Meal Plan Combinations */}
<Typography variant="subtitle1" sx={{ mt: 3 }}>Breakfast Only</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="breakfast_only_short_term"
      label="Breakfast Only Short Term"
      fullWidth
      value={formData.pricing?.breakfast_only_short_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="breakfast_only_medium_term"
      label="Breakfast Only Medium Term"
      fullWidth
      value={formData.pricing?.breakfast_only_medium_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="breakfast_only_long_term"
      label="Breakfast Only Long Term"
      fullWidth
      value={formData.pricing?.breakfast_only_long_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
</Grid>
<Typography variant="subtitle1" sx={{ mt: 3 }}>Lunch Only</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_only_short_term"
      label="Lunch Only Short Term"
      fullWidth
      value={formData.pricing?.lunch_only_short_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_only_medium_term"
      label="Lunch Only Medium Term"
      fullWidth
      value={formData.pricing?.lunch_only_medium_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_only_long_term"
      label="Lunch Only Long Term"
      fullWidth
      value={formData.pricing?.lunch_only_long_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
</Grid>
<Typography variant="subtitle1" sx={{ mt: 3 }}>Dinner Only</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="dinner_only_short_term"
      label="Dinner Only Short Term"
      fullWidth
      value={formData.pricing?.dinner_only_short_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="dinner_only_medium_term"
      label="Dinner Only Medium Term"
      fullWidth
      value={formData.pricing?.dinner_only_medium_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="dinner_only_long_term"
      label="Dinner Only Long Term"
      fullWidth
      value={formData.pricing?.dinner_only_long_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
</Grid>
<Typography variant="subtitle1" sx={{ mt: 3 }}>BF and Dinner</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="bf_and_dinner_short_term"
      label="BF and Dinner Short Term"
      fullWidth
      value={formData.pricing?.bf_and_dinner_short_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="bf_and_dinner_medium_term"
      label="BF and Dinner Medium Term"
      fullWidth
      value={formData.pricing?.bf_and_dinner_medium_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="bf_and_dinner_long_term"
      label="BF and Dinner Long Term"
      fullWidth
      value={formData.pricing?.bf_and_dinner_long_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
</Grid>
<Typography variant="subtitle1" sx={{ mt: 3 }}>Lunch and Dinner</Typography>
<Grid container spacing={2}>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_and_dinner_short_term"
      label="Lunch and Dinner Short Term"
      fullWidth
      value={formData.pricing?.lunch_and_dinner_short_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_and_dinner_medium_term"
      label="Lunch and Dinner Medium Term"
      fullWidth
      value={formData.pricing?.lunch_and_dinner_medium_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
    />
  </Grid>
  <Grid item xs={12} sm={4}>
    <TextField
      name="lunch_and_dinner_long_term"
      label="Lunch and Dinner Long Term"
      fullWidth
      value={formData.pricing?.lunch_and_dinner_long_term || ''}
      onChange={e => handleInputChange(e, 'pricing')}
      disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
                          disabled={!propertySelected}
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
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!propertySelected}
          >
            {dialogMode === 'add' ? 'Add Room' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete room "{selectedRoom?.room_no}"? This action cannot be undone.
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
              
              <Table size="small" sx={{ background: '#f8f8f8', borderRadius: 2, mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Meal Plan</TableCell>
                    <TableCell>Short Term</TableCell>
                    <TableCell>Medium Term</TableCell>
                    <TableCell>Long Term</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>BF and Dinner</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.bf_and_dinner_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.bf_and_dinner_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.bf_and_dinner_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lunch and Dinner</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_and_dinner_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_and_dinner_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_and_dinner_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dinner Only</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.dinner_only_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.dinner_only_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.dinner_only_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lunch Only</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_only_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_only_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.lunch_only_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Breakfast Only</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.breakfast_only_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.breakfast_only_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.breakfast_only_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Non-Veg</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.non_veg_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.non_veg_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.non_veg_long_term || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Veg</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.veg_short_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.veg_medium_term || '-'}</TableCell>
                    <TableCell>₹{pricingDetails.pricing?.veg_long_term || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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