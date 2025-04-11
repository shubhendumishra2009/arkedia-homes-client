import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Divider, Paper } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Arkedia Homes</title>
        <meta name="description" content="Learn more about Arkedia Homes and our mission to provide premium room rentals" />
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
                About Arkedia Homes
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Creating Comfortable Living Spaces Since 2010
              </Typography>
            </Box>
          </Container>
        </Box>

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
              Our Journey
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
              The story of how Arkedia Homes has evolved over the years.
            </Typography>
            
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {milestones.map((milestone, index) => (
                  <Grid item xs={12} key={index}>
                    <Box display="flex" alignItems="flex-start">
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          p: 2,
                          borderRadius: 1,
                          minWidth: '100px',
                          textAlign: 'center',
                          mr: 3
                        }}
                      >
                        <Typography variant="h6">{milestone.year}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h5" gutterBottom>{milestone.title}</Typography>
                        <Typography variant="body1">{milestone.description}</Typography>
                      </Box>
                    </Box>
                    {index < milestones.length - 1 && (
                      <Divider sx={{ my: 3 }} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
        </Box>
      </>
    </>
  );
}

// Team members data
const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO & Founder',
    bio: 'Sarah founded Arkedia Homes with a vision to create comfortable and affordable living spaces for young professionals and students. With over 15 years of experience in real estate and property management, she leads our team with passion and dedication.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Operations Manager',
    bio: 'Michael oversees the day-to-day operations of all Arkedia Homes properties. His background in hospitality management ensures that our residents receive exceptional service and prompt attention to their needs.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Priya Patel',
    position: 'Customer Relations Director',
    bio: 'Priya manages our customer relations team and ensures that every resident feels at home. Her warm personality and problem-solving skills make her an invaluable asset to our community.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'James Wilson',
    position: 'Maintenance Supervisor',
    bio: 'James leads our maintenance team with expertise and efficiency. With his background in construction and facility management, he ensures that all our properties are well-maintained and any issues are resolved quickly.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  }
];

// Company milestones
const milestones = [
  {
    year: '2010',
    title: 'Foundation',
    description: 'Arkedia Homes was founded with the acquisition of our first property in the heart of the city.'
  },
  {
    year: '2013',
    title: 'Expansion',
    description: 'Expanded to three additional locations, introducing our signature amenities and community-focused approach.'
  },
  {
    year: '2016',
    title: 'Innovation',
    description: 'Introduced smart home technology and eco-friendly features across all our properties.'
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description: 'Launched our online portal for seamless tenant experience and property management.'
  },
  {
    year: '2023',
    title: 'Community Focus',
    description: 'Established community programs and shared spaces to foster connections among residents.'
  }
]