import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, Paper } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import React from 'react';

// Global styles are in globals.css

function Home() {
  return (
    <>
      <Head>
        <title>Arkedia Homes | Premium Room Rentals</title>
        <meta name="description" content="Arkedia Homes offers premium room rentals with modern amenities and excellent service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <Box 
        component="section"
        sx={{
          position: 'relative',
          width: '100vw',
          height: '50vh',
          minHeight: '400px',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          component="img"
          src="/assets/banner.png"
          alt="Arkedia Homes Banner"
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 2
          }}
        />
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 2, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}
        >
          <Box sx={{ zIndex: 1, position: 'relative' }}>
            {/* Additional hero content can be placed here */}
          </Box>
        </Container>
      </Box>

      {/* Navigation Buttons - Below hero banner */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        padding: '20px 0',
        backgroundColor: '#F2F0EF',
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          padding: '15px 20px'
        }
      }}>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            href="/properties"
            sx={{
              minWidth: '180px',
              backgroundColor: '#84754E',
              '&:hover': {
                backgroundColor: '#6a613f'
              }
            }}
          >
            Take a Tour
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            component={Link}
            href="/contact"
            sx={{ 
              minWidth: '180px',
              color: 'primary.main',
              borderColor: 'primary.main',
              '&:hover': { 
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              } 
            }}
          >
            Contact Us
          </Button>
        </Box>

      {/* Features Section */}
      <Paper sx={{ backgroundColor: '#F2F0EF' }}>
              {/* Tag Line */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h5" component="p" sx={{ 
                  fontStyle: 'italic',
                  color: 'text.secondary',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}>
                  "When young minds from every corner come together under one roof, they don't just share a space—they build a future."
                  <Box component="span" display="block" sx={{ mt: 2, fontWeight: 'bold' }}>
                    That, in essence, is Arkedia Homes.
                  </Box>
                </Typography>
              </Box>

              {/* Why Choose Us */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" component="h3" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                  🏡 Why Choose Arkedia Homes
                </Typography>
                <Typography variant="body1" align="center" sx={{ fontSize: '1.1rem', mb: 4, maxWidth: '800px', mx: 'auto' }}>
                  More than a place to stay—it's a place to belong.
                  At Arkedia Homes we blend comfort, culture, and convenience to create a living experience that feels like home and inspires your journey.
                </Typography>

                {/* What Sets Us Apart */}
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" component="h4" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                    🌟 What Sets Us Apart
                  </Typography>
                  <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto' }}>
                    {[
                      { icon: '🛏️', title: 'Comfortable Living', description: 'Fully furnished rooms, cozy interiors, and peaceful ambiance' },
                      { icon: '🌐', title: 'Smart Amenities', description: 'High-speed Wi-Fi, digital booking, and multilingual chatbot support' },
                      { icon: '🔐', title: 'Safety & Security', description: '24/7 surveillance, secure access, and emergency assistance' },
                      { icon: '🎓', title: 'Student & Professional Friendly', description: 'Study zones, workspaces, and proximity to colleges and offices' },
                      { icon: '🎉', title: 'Cultural Connection', description: 'Local design elements, community events, and festive celebrations' }
                    ].map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ mb: 2 }}>{feature.icon}</Typography>
                          <Typography variant="h6" component="h5" sx={{ mb: 1, fontWeight: 'bold' }}>{feature.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Paper>

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
      <Box sx={{ bgcolor: '#84754E', color: 'white', py: 8 }}>
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

export default Home;