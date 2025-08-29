import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Head from 'next/head';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Layout from '@/components/Layout';

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqSections = [
    {
      title: 'For Tenants',
      items: [
        {
          question: 'How do I book a PG on ArkediaHomes?',
          answer: 'Search by location, filter by preferences, and click "Book Now". Pay a small booking fee online to confirm your bed.'
        },
        {
          question: 'Are all PG listings verified?',
          answer: 'Yes. Every property listed on ArkediaHomes is verified with ID proofs, on-ground checks, and updated amenities.'
        },
        {
          question: 'What is included in the rent?',
          answer: 'In most PGs, rent covers room charges, Wi-Fi, housekeeping, and security. Some PGs include meals, laundry, or gym facilities (shown in the listing).'
        },
        {
          question: 'Can I cancel a booking and get a refund?',
          answer: 'Yes. Refund Policy: 100% refund if cancelled 7+ days before check-in, 50% refund if cancelled 3–6 days before, No refund if less than 48 hours before.'
        },
        {
          question: 'Is my online payment secure?',
          answer: 'Absolutely. ArkediaHomes uses encrypted gateways (UPI, cards, net banking) to ensure safe transactions.'
        }
      ]
    },
    {
      title: 'For PG Owners',
      items: [
        {
          question: 'How do I list my PG on ArkediaHomes?',
          answer: 'Click "List Your PG" on our homepage, fill in details, upload documents & photos, and our team will verify before going live.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Rent payments are transferred directly to your bank account. You\'ll also get a dashboard for occupancy, collections, and reminders.'
        },
        {
          question: 'What are the charges for owners?',
          answer: 'ArkediaHomes charges a small commission per booking. Owners can also opt for premium visibility plans or full management option.'
        },
        {
          question: 'Do I need to manage tenants directly?',
          answer: 'Owners handle daily property management, but ArkediaHomes helps with tenant verification, rent collection, and digital support.'
        }
      ]
    },
    {
      title: 'General',
      items: [
        {
          question: 'What cities does ArkediaHomes operate in?',
          answer: 'We\'re starting with Sambalpur, Odisha, expanding to other cities soon.'
        },
        {
          question: 'Who can I contact for support?',
          answer: 'Reach us at arkediainfo@gmail.com or call +91-9692606186. Available Monday–Friday, 10 AM – 6PM.'
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>FAQ - Arkedia Homes</title>
        <meta name="description" content="Frequently asked questions about Arkedia Homes PG services for tenants and property owners" />
      </Head>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          
          {faqSections.map((section, sectionIndex) => (
            <Box key={sectionIndex} sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" sx={{ 
                color: 'primary.main', 
                mb: 3,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '60px',
                  height: '4px',
                  backgroundColor: 'primary.main',
                  borderRadius: '2px'
                }
              }}>
                {section.title}
              </Typography>
              
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {section.items.map((item, index) => {
                  const panelId = `panel-${sectionIndex}-${index}`;
                  return (
                    <Accordion 
                      key={index} 
                      elevation={0}
                      expanded={expanded === panelId}
                      onChange={handleChange(panelId)}
                      sx={{
                        '&:not(:last-child)': {
                          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
                        },
                        '&:before': {
                          display: 'none'
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`${panelId}-content`}
                        id={`${panelId}-header`}
                        sx={{
                          backgroundColor: expanded === panelId ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
                          }
                        }}
                      >
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {item.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Paper>
            </Box>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default FAQ;
