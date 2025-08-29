import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Paper, Button, Link as MuiLink } from '@mui/material';
import { LinkedIn, Instagram } from '@mui/icons-material';
import Link from 'next/link';

const Careers = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Head>
        <title>Careers - ArkediaHomes</title>
        <meta name="description" content="Join ArkediaHomes in reshaping PG living. Explore career opportunities and be part of our mission to transform shared housing." />
      </Head>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, my: 4, backgroundColor: '#f9f9f9' }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            🚀 Careers at ArkediaHomes
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Join Us in Reshaping PG Living
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}>
            At ArkediaHomes, we're building the future of shared living. Our platform helps students and professionals find safe, affordable, and managed PGs while empowering property owners with modern tools.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}>
            Even if we don't have open roles right now, we're always excited to meet passionate, driven people who share our vision.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            color: 'primary.main',
            textAlign: 'center',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main',
              margin: '10px auto 0',
              borderRadius: '2px'
            }
          }}>
            🌟 Why Work With Us?
          </Typography>
          
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {[
              "Meaningful Impact → Your work helps improve the lives of thousands of students and professionals searching for trusted housing.",
              "Culture of Collaboration → We thrive on teamwork, respect, and shared success.",
              "Growth & Learning → We encourage innovation, experimentation, and personal development.",
              "Mission-Driven → We are shaping an unorganized industry into a tech-enabled, trustworthy ecosystem."
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 2, color: 'primary.main', mt: '4px' }}>•</Box>
                <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 6, backgroundColor: '#fff', p: 4, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            color: 'primary.main',
            textAlign: 'center'
          }}>
            🔍 Current Openings
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', fontSize: '1.1rem', maxWidth: '700px', mx: 'auto' }}>
            At the moment, we don't have active job postings. But don't worry—our journey has just begun, and exciting opportunities are coming soon!
          </Typography>
        </Box>

        <Box sx={{ backgroundColor: '#f0f7ff', p: 5, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            color: 'primary.main',
            textAlign: 'center'
          }}>
            📩 Stay Connected
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 4, fontSize: '1.1rem' }}>
            If you'd like to work with ArkediaHomes in the future:
          </Typography>
          
          <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Box sx={{ 
              backgroundColor: 'white', 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Send us your details
              </Typography>
              <Typography variant="body1" paragraph>
                Email your CV and a short note about your interest to:
              </Typography>
              <MuiLink 
                href="mailto:careers@arkediahomes.com" 
                color="primary"
                sx={{ 
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                careers@arkediahomes.com
              </MuiLink>
            </Box>
            
            <Box sx={{ 
              backgroundColor: 'white', 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              boxShadow: 1,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Follow us on social media
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <MuiLink 
                  href="https://www.linkedin.com/company/arkediahomes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <LinkedIn fontSize="large" />
                  <Typography variant="caption">LinkedIn</Typography>
                </MuiLink>
                <MuiLink 
                  href="https://www.instagram.com/arkediahomes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  <Instagram fontSize="large" />
                  <Typography variant="caption">Instagram</Typography>
                </MuiLink>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic' }}>
              Check back here for upcoming roles in Tech, Operations, Sales, and Marketing.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Careers;
