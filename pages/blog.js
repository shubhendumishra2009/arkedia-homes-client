import React from 'react';
import { Container, Typography, Box, Paper, Divider, Button, Grid, Card, CardContent } from '@mui/material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const BlogPost = () => {
  return (
    <>
      <Head>
        <title>The Future of PG Living | ArkediaHomes Blog</title>
        <meta name="description" content="Discover how ArkediaHomes is transforming the PG living experience with verified listings, online bookings, and smart management solutions for tenants and property owners." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Button 
            component={Link} 
            href="/" 
            startIcon={<ArrowBackIcon />} 
            sx={{ mb: 3, color: 'primary.main' }}
          >
            Back to Home
          </Button>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, mb: 6, borderRadius: 2 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              The Future of PG Living: How ArkediaHomes is Redefining Shared Housing
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                August 29, 2025
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                <Button size="small" startIcon={<ShareIcon />} sx={{ textTransform: 'none' }}>
                  Share
                </Button>
                <Button size="small" startIcon={<BookmarkBorderIcon />} sx={{ textTransform: 'none' }}>
                  Save
                </Button>
              </Box>
            </Box>

            <Box 
              component="img"
              src="/assets/blog/pg-living-future.jpg" 
              alt="Modern PG Living Space"
              sx={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4
              }}
            />

            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 6 }}>
                Introduction
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Finding a safe, affordable, and comfortable PG has always been a challenge for students and working professionals in India. From unclear pricing to unverified owners, the experience has often been frustrating. At ArkediaHomes, we believe PG living should be simple, transparent, and stress-free.
              </Typography>

              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 6 }}>
                Why the PG Industry Needs Change
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 4 }}>
                {[
                  'Growing demand → Millions of students and professionals migrate every year.',
                  'Lack of trust → Many PGs operate without verification, leading to safety and quality issues.',
                  'Manual processes → Rent collection, tenant management, and occupancy tracking are still offline.',
                  'Fragmented market → With no unified platform, tenants spend weeks searching.'
                ].map((item, index) => (
                  <Typography 
                    key={index} 
                    component="li" 
                    variant="body1" 
                    sx={{ mb: 1.5, position: 'relative', pl: 2, '&:before': { content: '"•"', position: 'absolute', left: 0 } }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>

              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 6 }}>
                How ArkediaHomes Solves This
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  'Verified PG Listings – Every property is vetted for safety, documentation, and amenities.',
                  'Online Booking & Payments – Tenants can book rooms and pay securely in just a few clicks.',
                  'Owner Dashboard – PG owners get tools for digital rent collection, occupancy tracking, and tenant verification.',
                  'End-to-End Management – For owners who want full support, we handle everything from tenant onboarding to maintenance.'
                ].map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>{item.split('–')[0]}</Box>
                        {item.split('–').slice(1).join('–')}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={4} sx={{ my: 6 }}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Benefits for Tenants
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                        {[
                          'Hassle-free online search & booking.',
                          'Transparent pricing with no hidden costs.',
                          'Flexible lease options.',
                          'Safe, verified living spaces.'
                        ].map((item, index) => (
                          <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Benefits for PG Owners
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                        {[
                          'Higher occupancy rates with online visibility.',
                          'Automated rent reminders & collections.',
                          'Reduced fraud through tenant KYC verification.',
                          'Option to hand over full management to ArkediaHomes.'
                        ].map((item, index) => (
                          <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3, mt: 6 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                ArkediaHomes is not just another listing platform. We are building the Airbnb of PGs—a trusted ecosystem where tenants and owners win together. Starting from Bengaluru, Pune, NCR, and Hyderabad, we aim to expand to 10+ cities in the next 2 years.
              </Typography>

              <Box sx={{ 
                bgcolor: 'background.paper', 
                p: 4, 
                borderRadius: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                mt: 8,
                textAlign: 'center'
              }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                  Ready to Experience Better PG Living?
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                  Join thousands of happy tenants and PG owners who trust ArkediaHomes for a better living experience.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    component={Link} 
                    href="/properties"
                    sx={{ minWidth: '200px' }}
                  >
                    Find a PG
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    component={Link} 
                    href="/contact"
                    sx={{ minWidth: '200px' }}
                  >
                    List Your Property
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default BlogPost;
