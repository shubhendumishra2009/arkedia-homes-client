import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Arkedia Homes | Premium Room Rentals</title>
        <meta name="description" content="Arkedia Homes offers premium room rentals with modern amenities and excellent service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <Box sx={{
          backgroundImage: `url(/assets/banner.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '100px 0',
          textAlign: 'center',
          position: 'relative'
        }}>
        <Container maxWidth="lg">
          <Box sx={{ zIndex: 1, position: 'relative' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Arkedia Homes
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Premium Room Rentals for Comfortable Living
            </Typography>
            <Box mt={4}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={Link}
                href="/gallery"
              >
                View Rooms
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ ml: 2 }}
                component={Link}
                href="/contact"
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Arkedia Homes?
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Premium Locations
                </Typography>
                <Typography variant="body1">
                  Our properties are located in prime areas with easy access to public transportation, shopping centers, and entertainment venues.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Modern Amenities
                </Typography>
                <Typography variant="body1">
                  Enjoy modern amenities including high-speed internet, 24/7 security, maintenance services, and fully furnished options.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Flexible Leases
                </Typography>
                <Typography variant="body1">
                  We offer flexible lease terms to accommodate your needs, whether you're looking for short-term or long-term accommodation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Room Types Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Our Room Types
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{ height: 200, bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3">
                    Single Room
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Perfect for individuals seeking comfort and privacy.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{ height: 200, bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3">
                    Double Room
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Spacious accommodation for couples or friends.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{ height: 200, bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3">
                    Deluxe Room
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Premium features with enhanced comfort and style.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{ height: 200, bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3">
                    Suite
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Luxury accommodation with separate living area.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box mt={4} textAlign="center">
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              href="/pricing"
            >
              View Pricing
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          What Our Tenants Say
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "I've been living at Arkedia Homes for over a year now, and I couldn't be happier with my choice. The staff is responsive, and the facilities are well-maintained."
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  - Sarah Johnson
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "The location is perfect for my needs, and the community here is friendly and welcoming. I appreciate the regular maintenance and security services."
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  - Michael Chen
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="body1" paragraph>
                  "Moving to Arkedia Homes was one of the best decisions I've made. The rooms are spacious, modern, and the management is professional and attentive."
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  - Emily Rodriguez
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Find Your New Home?
          </Typography>
          <Typography variant="h6" component="p" align="center" gutterBottom>
            Browse our available rooms and start your application today.
          </Typography>
          <Box mt={4} textAlign="center">
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              href="/signup"
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              sx={{ ml: 2, color: 'white', borderColor: 'white' }} 
              size="large"
              component={Link}
              href="/contact"
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}