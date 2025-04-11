import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, Divider, Snackbar, Alert, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

export default function Booking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    identityType: '',
    identityNumber: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });
  
  const [roomDetails, setRoomDetails] = useState({
    category: '',
    roomType: '',
    duration: '',
    price: ''
  });
  
  // Handle query parameters from pricing page
  useEffect(() => {
    // Check if we have query parameters from pricing page
    if (router.isReady) {
      const { category, roomType, duration, price } = router.query;
      
      // If we have pricing parameters, update the room details
      if (category && roomType && duration && price) {
        setRoomDetails({
          category,
          roomType,
          duration,
          price
        });
      } else {
        // If no parameters, redirect back to pricing page
        router.push('/pricing');
      }
    }
  }, [router.isReady, router.query]);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }
    
    if (!formData.identityType) {
      newErrors.identityType = 'Identity type is required';
    }
    
    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = 'Identity number is required';
    }
    
    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, this would send the form data to a server
      console.log('Booking submitted:', { ...formData, ...roomDetails });
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Your booking has been submitted successfully! We will confirm your booking soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        identityType: '',
        identityNumber: '',
        checkInDate: '',
        checkOutDate: '',
        specialRequests: ''
      });
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Identity document types
  const identityTypes = [
    'Aadhaar Card',
    'Passport',
    'Driving License',
    'Voter ID',
    'PAN Card'
  ];

  return (
    <>
      <Head>
        <title>Book a Room | Arkedia Homes</title>
        <meta name="description" content="Book your stay at Arkedia Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <Box sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/assets/banner.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ zIndex: 1, position: 'relative' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Book Your Stay
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Complete Your Booking Details
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Booking Content */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={6}>
          {/* Room Details Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Selected Room
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Room Category
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {roomDetails.category}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Room Type
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {roomDetails.roomType}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Stay Duration
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {roomDetails.duration}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Price
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {roomDetails.price}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="body2" color="text.secondary">
                  * Prices include all taxes and basic amenities.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  * Additional services can be requested during your stay.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Booking Form */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h2" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body1" paragraph>
              Please fill in your details to complete the booking process.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* Personal Details */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                
                {/* Address Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Address Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="state"
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={!!errors.state}
                    helperText={errors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="pincode"
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    error={!!errors.pincode}
                    helperText={errors.pincode}
                  />
                </Grid>
                
                {/* Identity Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Identity Verification
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.identityType}>
                    <InputLabel id="identity-type-label">Identity Document Type</InputLabel>
                    <Select
                      labelId="identity-type-label"
                      id="identityType"
                      name="identityType"
                      value={formData.identityType}
                      label="Identity Document Type"
                      onChange={handleInputChange}
                    >
                      {identityTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                    {errors.identityType && (
                      <Typography variant="caption" color="error">
                        {errors.identityType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="identityNumber"
                    label="Identity Document Number"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleInputChange}
                    error={!!errors.identityNumber}
                    helperText={errors.identityNumber}
                  />
                </Grid>
                
                {/* Stay Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Stay Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="checkInDate"
                    label="Check-in Date"
                    name="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.checkInDate}
                    helperText={errors.checkInDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="checkOutDate"
                    label="Check-out Date (if applicable)"
                    name="checkOutDate"
                    type="date"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="specialRequests"
                    label="Special Requests (if any)"
                    name="specialRequests"
                    multiline
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                  />
                </Grid>
                
                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Complete Booking
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    * By completing this booking, you agree to our terms and conditions.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    * Payment details will be collected at a later stage.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}