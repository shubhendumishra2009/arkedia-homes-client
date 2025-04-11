import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Button } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import WifiIcon from '@mui/icons-material/Wifi';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SecurityIcon from '@mui/icons-material/Security';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Link from 'next/link';

export default function Services() {
  // Core services
  const coreServices = [
    {
      id: 1,
      title: 'Laundry Services',
      description: 'Access to modern washing and drying facilities available 24/7. We provide high-efficiency machines that save water and energy while giving excellent cleaning results.',
      icon: <LocalLaundryServiceIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 2,
      title: 'High-Speed Internet',
      description: 'Complimentary high-speed fiber internet throughout the building. Perfect for streaming, gaming, or working from home with reliable connections.',
      icon: <WifiIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 3,
      title: 'Cleaning Services',
      description: 'Optional weekly or bi-weekly cleaning services for your room. Our professional cleaning staff ensures your living space remains spotless and hygienic.',
      icon: <CleaningServicesIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 4,
      title: '24/7 Security',
      description: 'Round-the-clock security with modern surveillance systems and secure access control. Your safety is our priority with trained security personnel always on duty.',
      icon: <SecurityIcon sx={{ fontSize: 60 }} color="primary" />
    }
  ];

  // Premium services
  const premiumServices = [
    {
      id: 1,
      title: 'Fitness Center',
      description: 'State-of-the-art fitness center with cardio equipment, weights, and yoga space. Open 24/7 for your convenience with regular equipment maintenance.',
      icon: <FitnessCenterIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 2,
      title: 'Dining Options',
      description: 'On-site café serving breakfast and lunch with healthy meal options. We also offer meal plan subscriptions for residents seeking convenient dining solutions.',
      icon: <RestaurantIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 3,
      title: 'Parking Facilities',
      description: 'Secure underground parking available for residents. We offer both monthly and annual parking plans with designated spots for each resident.',
      icon: <DirectionsCarIcon sx={{ fontSize: 60 }} color="primary" />
    },
    {
      id: 4,
      title: 'Community Spaces',
      description: 'Access to shared lounges, study rooms, and entertainment areas. Our community spaces are designed to foster connections and provide comfortable areas for relaxation or work.',
      icon: <MeetingRoomIcon sx={{ fontSize: 60 }} color="primary" />
    }
  ];

  // Additional services
  const additionalServices = [
    {
      title: 'Maintenance Services',
      description: 'Our dedicated maintenance team responds quickly to any issues in your room. From minor repairs to major concerns, we ensure your living space remains in perfect condition.',
      included: true
    },
    {
      title: 'Package Reception',
      description: 'Secure package reception and notification system. Never miss a delivery with our staff accepting packages on your behalf and notifying you immediately.',
      included: true
    },
    {
      title: 'Utility Management',
      description: 'All utilities included in your rent with no surprise costs. Water, electricity, heating, and cooling are all covered in your monthly payment.',
      included: true
    },
    {
      title: 'Community Events',
      description: 'Regular social events and activities for residents. From game nights to seasonal celebrations, we create opportunities for you to meet your neighbors.',
      included: true
    },
    {
      title: 'Bicycle Storage',
      description: 'Secure indoor bicycle storage facilities. Keep your bike safe from weather and theft with our dedicated storage area.',
      included: true
    },
    {
      title: 'Guest Accommodation',
      description: 'Guest rooms available for friends and family visits. Book comfortable accommodations for your visitors at special resident rates.',
      included: false
    },
    {
      title: 'Airport Shuttle',
      description: 'Scheduled airport shuttle service for convenient travel. Available at additional cost with advance booking required.',
      included: false
    },
    {
      title: 'Pet Care',
      description: 'Pet sitting and dog walking services available. Our pet-friendly building offers services to care for your furry friends when you are away.',
      included: false
    }
  ];

  return (
    <>
      <Head>
        <title>Our Services | Arkedia Homes</title>
        <meta name="description" content="Discover the premium services and amenities offered at Arkedia Homes" />
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
                Our Services
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Premium Amenities for Comfortable Living
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Core Services Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Core Services
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            All our residents enjoy these essential services included in their monthly rent
          </Typography>
          
          <Grid container spacing={4}>
            {coreServices.map((service) => (
              <Grid item xs={12} sm={6} md={3} key={service.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 2, boxShadow: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {service.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Premium Services Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" align="center" gutterBottom>
              Premium Services
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
              Enhance your living experience with our premium amenities
            </Typography>
            
            <Grid container spacing={4}>
              {premiumServices.map((service) => (
                <Grid item xs={12} sm={6} md={3} key={service.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 2, boxShadow: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3">
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Additional Services Table */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Additional Services
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            A comprehensive list of all services available to our residents
          </Typography>
          
          <Grid container spacing={3}>
            {additionalServices.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ display: 'flex', height: '100%', boxShadow: 2 }}>
                  <Box sx={{ 
                    width: 5, 
                    bgcolor: service.included ? 'success.main' : 'text.disabled'
                  }} />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="h3">
                        {service.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          bgcolor: service.included ? 'success.light' : 'grey.300',
                          color: service.included ? 'success.contrastText' : 'text.secondary',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {service.included ? 'Included' : 'Additional Cost'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Experience Our Premium Services?
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
              Contact us today to schedule a tour or learn more about our available rooms and services.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={Link}
                href="/contact"
              >
                Contact Us
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                component={Link}
                href="/pricing"
              >
                View Pricing
              </Button>
            </Box>
          </Container>
        </Box>
      </>
    </>
  );
}