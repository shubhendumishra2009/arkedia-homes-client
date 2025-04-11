import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, TextField, Button, Paper, Divider, Snackbar, Alert, Card, CardContent } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // Handle query parameters from pricing page
  useEffect(() => {
    // Check if we have query parameters from pricing page
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      const roomType = params.get('roomType');
      const duration = params.get('duration');
      const price = params.get('price');
      
      // If we have pricing parameters, update the form
      if (category && roomType && duration && price) {
        // Set subject with room details
        setFormData(prev => ({
          ...prev,
          subject: `Booking Inquiry: ${category} ${roomType} Room`,
          message: `I'm interested in booking a ${category} ${roomType} room for ${duration} at ${price}. Please provide more information about availability and booking process.`
        }));
      }
    }
  }, []);

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
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, this would send the form data to a server
      console.log('Form submitted:', formData);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Contact information
  const contactInfo = [
    {
      icon: <LocationOnIcon fontSize="large" color="primary" />,
      title: 'Our Location',
      details: [
        '123 Arkedia Street',
        'Cityville, State 12345',
        'United States'
      ]
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone Numbers',
      details: [
        'Main Office: (555) 123-4567',
        'Maintenance: (555) 987-6543',
        'After Hours: (555) 789-0123'
      ]
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email Addresses',
      details: [
        'General Inquiries: info@arkediahomes.com',
        'Leasing: leasing@arkediahomes.com',
        'Support: support@arkediahomes.com'
      ]
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'Office Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 10:00 AM - 4:00 PM',
        'Sunday: Closed'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us | Arkedia Homes</title>
        <meta name="description" content="Get in touch with Arkedia Homes for inquiries about our premium room rentals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
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
                Contact Us
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                We'd Love to Hear From You
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Contact Information Cards */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Grid container spacing={4}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box mb={2}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {info.title}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {info.details.map((detail, i) => (
                      <Typography variant="body2" key={i} sx={{ mb: 1 }}>
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Contact Form */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Send Us a Message
              </Typography>
              <Typography variant="body1" paragraph>
                Have a question or need more information? Fill out the form below and we'll get back to you as soon as possible.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Your Name"
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="subject"
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="message"
                      label="Your Message"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      error={!!errors.message}
                      helperText={errors.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                Visit Our Office
              </Typography>
              <Typography variant="body1" paragraph>
                We'd love to meet you in person. Stop by our main office during business hours.
              </Typography>
              
              <Paper sx={{ height: '400px', width: '100%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Map will be displayed here
                </Typography>
              </Paper>
              
              <Typography variant="body2" color="text.secondary">
                * Please note that appointments are recommended for property viewings.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}