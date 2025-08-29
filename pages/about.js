import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Paper } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Er. Dev Mahapatra',
    position: 'CEO & Founder',
    bio: 'Er. Dev Mahapatra founded Arkedia Homes with a vision to create comfortable and affordable living spaces for young professionals and students. With over 10 years of experience in real estate and property management, he leads our team with passion and dedication.',
    image: '/assets/teams/devmahapatra.jpg'
  },
  {
    id: 2,
    name: 'Nandita Mahapatra',
    position: 'CFO',
    bio: 'Nandita Mahapatra oversees the day-to-day operations of all Arkedia Homes properties. Her background in finance management ensures that our residents receive exceptional service and prompt attention to their needs.',
    image: '/assets/teams/nanditamahapatra.jpg'
  },
  {
    id: 3,
    name: 'Priyansha Pati',
    position: 'HR VP',
    bio: 'Priyansha Pati manages our customer and staff relations team and ensures that every resident feels at home. Her warm personality and problem-solving skills make her an invaluable asset to our community.',
    image: '/assets/teams/priyanshapati.jpg'
  },
  {
    id: 4,
    name: 'Shubhendu Mishra',
    position: 'IT Head',
    bio: 'Shubhendu Mishra ensures all our properties are well-maintained and meet our high standards of quality. His attention to detail and proactive approach keeps our facilities running smoothly.',
    image: '/assets/teams/shubhendumishra.jpg'
  }
];

// Company milestones
const milestones = [
  {
    year: '2020',
    title: 'The Spark',
    description: 'Identified the challenges students and professionals face in PG living and conducted initial research into proptech and co-living opportunities.'
  },
  {
    year: '2021',
    title: 'Foundation Laid',
    description: 'ArkediaHomes brand was conceptualized. We drafted the business model and created our first digital prototype.'
  },
  {
    year: '2025',
    title: 'Building the Platform',
    description: 'Developed tenant-side booking experience, designed owner dashboard for property listing and digital rent collection, and prepared all necessary legal policies and documentation.'
  }
];

export default function About() {
  return (
    <Box>
      <Head>
        <title>About Us | Arkedia Homes</title>
        <meta name="description" content="Learn more about Arkedia Homes and our mission to provide premium room rentals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
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
                About Arkedia Homes
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Creating Comfortable Living Spaces Since 2010
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Welcome Section - Moved to top */}
        <Container maxWidth="lg" sx={{ my: 8, mt: 4 }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h3" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
              Welcome to Arkedia Homes
            </Typography>
            <Box sx={{ 
              backgroundColor: 'primary.light', 
              p: 4, 
              borderRadius: 2,
              textAlign: 'center',
              mb: 6
            }}>
              <Typography variant="h5" component="p" sx={{ mb: 3, fontWeight: 'bold' }}>
                Where comfort meets culture. 🌿
              </Typography>
              <Typography variant="body1" paragraph>
                From high-speed Wi-Fi to home-cooked meals, we've got everything to make your stay stress-free.
              </Typography>
              <Typography variant="body1" paragraph>
                Whether you're a student chasing dreams or a professional building yours, we're your home away from home.
              </Typography>
              <Typography variant="body1">
                Virtual tours, multilingual support, and a community that cares—right where you need it.
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* Director's Note - Commented out as per request
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, mb: 8, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
              Director's Note
            </Typography>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Dear Guests and Well-Wishers,
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Welcome to Arkedia Homes—more than just a place to stay, we're a place to belong.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Our journey began with a simple yet powerful idea: to create a PG accommodation experience that feels like home, no matter where you come from. In a world that's constantly moving, we believe everyone deserves a space that offers comfort, connection, and care.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                At Arkedia Homes, we've woven together modern amenities with local warmth. From culturally inspired interiors to multilingual support and responsive digital features, every detail is designed to make your stay seamless and meaningful.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                We're proud to host a diverse community of students, professionals, and dreamers—each bringing their own story, and each finding a safe, inclusive space to grow. Our commitment goes beyond hospitality; it's about fostering friendships, supporting aspirations, and celebrating the vibrant spirit of shared living.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                As we continue to expand and evolve, our promise remains the same: to offer you a place where you're not just accommodated, but truly welcomed.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Thank you for being part of our journey. We invite you to explore, engage, and make Arkedia Homes your home away from home.
              </Typography>
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Warm regards,
                </Typography>
                <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                  Er Dev P Mahapatra
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Director, Arkedia Homes
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
        */}

        {/* About Us Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
              About Us
            </Typography>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, mb: 6, backgroundColor: '#fff' }}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                At Arkedia Homes, we believe that a place to stay should be more than just four walls—it should be a space where you feel safe, supported, and truly at home.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Founded with the vision of creating culturally connected and inclusive living spaces, our PG accommodations are thoughtfully designed for students, professionals, and anyone seeking comfort with a sense of belonging.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Whether you're moving to a new city for studies or work, we offer a range of options—from cozy single rooms to vibrant shared spaces—all equipped with modern amenities like high-speed Wi-Fi, nutritious meals, 24/7 security, and regular housekeeping.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                What sets us apart is our commitment to community. We celebrate diversity, foster friendships, and ensure that every resident feels heard and cared for. Our digital-first approach includes virtual tours, multilingual support, and a responsive interface to make your experience smooth and stress-free.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                Located in prime areas with easy access to educational institutions, business hubs, and public transport, Arkedia Homes is your trusted partner in urban living.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                Come stay with us—and discover a place where comfort meets culture, and every guest becomes family.
              </Typography>
            </Paper>
            
          </Box>
        </Container>

        {/* Team Section */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Meet the dedicated professionals who make Arkedia Homes a wonderful place to live.
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={member.image}
                    alt={member.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {member.position}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Company History */}
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" align="center" gutterBottom>
              🌍 Our Journey – ArkediaHomes
            </Typography>
            <Typography variant="h5" align="center" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              From Idea to Impact
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 6, lineHeight: 1.8 }}>
              ArkediaHomes was born with a simple belief: finding a safe and affordable PG should be as easy as booking a cab or ordering food online. What started as an idea to bring transparency and trust into the fragmented PG market has grown into a platform empowering both tenants and property owners.
            </Typography>
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 8, mb: 4 }}>
              📅 Timeline & Milestones
            </Typography>
            
            <Box sx={{ position: 'relative', maxWidth: '1000px', mx: 'auto', py: 4 }}>
              {/* Timeline line */}
              <Box sx={{
                position: 'absolute',
                left: { xs: '24px', md: '50%' },
                top: 0,
                bottom: 0,
                width: '4px',
                bgcolor: 'primary.light',
                transform: 'translateX(-50%)',
                zIndex: 1,
                display: { xs: 'block' }
              }} />
              
              {/* Milestone Cards */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {milestones.map((milestone, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                      alignItems: 'center',
                      mb: { xs: 6, md: 8 },
                      position: 'relative',
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    {/* Year Badge */}
                    <Box 
                      sx={{
                        width: { xs: '60px', md: '100px' },
                        height: { xs: '60px', md: '100px' },
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2,
                        border: '4px solid white',
                        boxShadow: 3,
                        mx: 'auto',
                        mb: { xs: 2, md: 0 }
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {milestone.year}
                      </Typography>
                    </Box>
                    
                    {/* Connecting line for desktop */}
                    <Box 
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        width: '50%',
                        height: '4px',
                        bgcolor: 'primary.light',
                        position: 'absolute',
                        left: index % 2 === 0 ? '50%' : '0',
                        top: '50px',
                        zIndex: 1
                      }}
                    />
                    
                    {/* Card */}
                    <Box 
                      sx={{
                        width: { xs: '100%', md: 'calc(50% - 50px)' },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                        position: 'relative',
                        ml: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                        mr: { xs: 0, md: index % 2 === 0 ? 0 : 4 },
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          transition: 'transform 0.3s ease',
                          boxShadow: 6
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          color: 'primary.main',
                          mb: 2,
                          fontWeight: 'bold',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: '50px',
                            height: '3px',
                            bgcolor: 'primary.main'
                          }
                        }}
                      >
                        {milestone.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        {milestone.description}
                      </Typography>
                      
                      {/* Arrow for mobile */}
                      <Box 
                        sx={{
                          display: { xs: 'block', md: 'none' },
                          position: 'absolute',
                          left: '50%',
                          bottom: -20,
                          transform: 'translateX(-50%) rotate(90deg)',
                          color: 'primary.main',
                          fontSize: '24px',
                          lineHeight: 1
                        }}
                      >
                        ↓
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
