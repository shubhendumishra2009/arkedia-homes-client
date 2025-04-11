import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Paper, Tabs, Tab, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useState } from 'react';
import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

export default function Pricing() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  // Function to handle price cell clicks and redirect to booking page with selected plan details
  const handlePriceClick = (category, roomType, durationType, price) => {
    // Get the duration name from the stayDurations array
    const duration = roomPricingData.stayDurations.find(d => d.id === durationType)?.name || durationType;
    
    // Create query parameters with selected plan details
    const queryParams = new URLSearchParams({
      category,
      roomType,
      duration,
      price
    }).toString();
    
    // Redirect to booking page with query parameters
    window.location.href = `/booking?${queryParams}`;
  };

  // Room pricing data based on the new pricing structure
  const roomPricingData = {
    categories: [
      {
        name: 'CLASSIC',
        rooms: [
          {
            type: 'SINGLE',
            pricing: {
              shortTerm: 'Rs.400/- per Day',
              mediumTerm: 'Rs. 8000/- per month',
              longTerm: 'Rs. 6000/- per month',
              withFooding: 'Rs.9500/- per month per person'
            }
          },
          {
            type: 'DOUBLE',
            pricing: {
              shortTerm: 'Rs550/- Per Day',
              mediumTerm: 'Rs. 8000/- per month',
              longTerm: 'Rs. 4000/- per month per person',
              withFooding: 'Rs.7500/- per month per person'
            }
          }
        ]
      },
      {
        name: 'DELUXE NON-AC',
        rooms: [
          {
            type: 'SINGLE',
            pricing: {
              shortTerm: 'Rs. 700 Per day',
              mediumTerm: 'Rs. 10000/- per month',
              longTerm: 'Rs. 7500/- per month',
              withFooding: 'Rs.11000/- per month per person'
            }
          },
          {
            type: 'DOUBLE',
            pricing: {
              shortTerm: 'Rs. 850 Per day',
              mediumTerm: 'Rs. 10000/- per month',
              longTerm: 'Rs. 4500/- per month per person',
              withFooding: 'Rs.8500/- per month per person'
            }
          }
        ]
      },
      {
        name: 'DELUXE AC',
        rooms: [
          {
            type: 'SINGLE',
            pricing: {
              shortTerm: 'RS 950 Per Day',
              mediumTerm: 'Rs. 15000/- per month',
              longTerm: 'Rs. 8500/- per month',
              withFooding: 'Rs.12000/- per month per person'
            }
          },
          {
            type: 'DOUBLE',
            pricing: {
              shortTerm: 'Rs 1050 Per Day.',
              mediumTerm: 'Rs. 15000/- per month',
              longTerm: 'Rs. 5500/- per month per person',
              withFooding: 'Rs.9000/- per month per person'
            }
          }
        ]
      }
    ],
    stayDurations: [
      {
        id: 'shortTerm',
        name: 'LESS THAN 1 MONTH & MORE THEN 10 DAYS'
      },
      {
        id: 'mediumTerm',
        name: 'ONE TO FOUR MONTHS'
      },
      {
        id: 'longTerm',
        name: 'FIVE MONTHS AND ABOVE'
      },
      {
        id: 'withFooding',
        name: 'REGULAR 5 MONTHS AND ABOVE',
        withFooding: true
      }
    ]
  };
  
  // Legacy pricing plans for reference
  const pricingPlans = [
    {
      id: 1,
      type: 'Single Room',
      price: 800,
      period: 'month',
      description: 'Cozy and comfortable single rooms perfect for individuals.',
      features: [
        { feature: '250 sq.ft Area', included: true },
        { feature: 'Single Bed', included: true },
        { feature: 'Study Desk', included: true },
        { feature: 'Wardrobe', included: true },
        { feature: 'Wi-Fi', included: true },
        { feature: 'Shared Bathroom', included: true },
        { feature: 'Air Conditioning', included: false },
        { feature: 'Private Balcony', included: false }
      ],
      popular: false,
      color: 'default'
    },
    {
      id: 2,
      type: 'Double Room',
      price: 1200,
      period: 'month',
      description: 'Spacious double rooms ideal for those who prefer more space.',
      features: [
        { feature: '350 sq.ft Area', included: true },
        { feature: 'Queen Bed', included: true },
        { feature: 'Work Desk', included: true },
        { feature: 'Wardrobe', included: true },
        { feature: 'Wi-Fi', included: true },
        { feature: 'Private Bathroom', included: true },
        { feature: 'Air Conditioning', included: true },
        { feature: 'Private Balcony', included: true }
      ],
      popular: true,
      color: 'primary'
    },
    {
      id: 3,
      type: 'Deluxe Room',
      price: 1500,
      period: 'month',
      description: 'Premium deluxe rooms with enhanced amenities and comfort.',
      features: [
        { feature: '450 sq.ft Area', included: true },
        { feature: 'King Bed', included: true },
        { feature: 'Work Desk', included: true },
        { feature: 'Walk-in Wardrobe', included: true },
        { feature: 'High-Speed Wi-Fi', included: true },
        { feature: 'Private Bathroom', included: true },
        { feature: 'Air Conditioning', included: true },
        { feature: 'Private Balcony', included: true }
      ],
      popular: false,
      color: 'secondary'
    },
    {
      id: 4,
      type: 'Suite',
      price: 1800,
      period: 'month',
      description: 'Luxurious suites offering the ultimate comfort and space.',
      features: [
        { feature: '550 sq.ft Area', included: true },
        { feature: 'King Bed', included: true },
        { feature: 'Separate Work Area', included: true },
        { feature: 'Walk-in Wardrobe', included: true },
        { feature: 'Premium Wi-Fi', included: true },
        { feature: 'Luxury Bathroom', included: true },
        { feature: 'Climate Control', included: true },
        { feature: 'Private Terrace', included: true }
      ],
      popular: false,
      color: 'default'
    }
  ];

  // Lease term options
  const leaseTerms = [
    {
      id: 1,
      term: 'Monthly',
      description: 'Flexible month-to-month leasing with no long-term commitment',
      discount: 0,
      securityDeposit: '1 month rent',
      cancellationPolicy: '30 days notice required'
    },
    {
      id: 2,
      term: '3 Months',
      description: 'Short-term lease perfect for seasonal stays',
      discount: 5,
      securityDeposit: '1 month rent',
      cancellationPolicy: '45 days notice required'
    },
    {
      id: 3,
      term: '6 Months',
      description: 'Medium-term commitment with better rates',
      discount: 10,
      securityDeposit: '1 month rent',
      cancellationPolicy: '60 days notice required'
    },
    {
      id: 4,
      term: '12 Months',
      description: 'Our best value option for long-term residents',
      discount: 15,
      securityDeposit: '1 month rent',
      cancellationPolicy: '90 days notice required'
    }
  ];

  // Additional fees and charges
  const additionalFees = [
    {
      name: 'Application Fee',
      amount: '₹3,500',
      description: 'One-time non-refundable fee for processing your application'
    },
    {
      name: 'Security Deposit',
      amount: '1 month rent',
      description: 'Refundable deposit returned at the end of your lease (subject to room condition)'
    },
    {
      name: 'Utility Package',
      amount: 'Included',
      description: 'Water, electricity, heating, and cooling included in monthly rent'
    },
    {
      name: 'Internet & Cable',
      amount: 'Included',
      description: 'High-speed internet and basic cable included in monthly rent'
    },
    {
      name: 'Parking',
      amount: '₹7,000/month',
      description: 'Optional reserved parking space in our secure garage'
    },
    {
      name: 'Pet Fee',
      amount: '₹21,000 + ₹2,100/month',
      description: 'One-time non-refundable fee plus monthly pet rent (where applicable)'
    },
    {
      name: 'Early Termination Fee',
      amount: '2 months rent',
      description: 'Fee for breaking your lease before the agreed term ends'
    },
    {
      name: 'Late Payment Fee',
      amount: '₹3,500 + ₹700/day',
      description: 'Fee charged for payments received after the 5th of each month'
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing | Arkedia Homes</title>
        <meta name="description" content="View our competitive pricing options for premium room rentals at Arkedia Homes" />
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
                Our Pricing
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Transparent Pricing for Quality Living
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Pricing Tabs */}
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange} 
              centered
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Room Pricing" />
              <Tab label="Lease Terms" />
              <Tab label="Additional Fees" />
            </Tabs>
          </Box>

          {/* Room Pricing Tab */}
          {selectedTab === 0 && (
            <>
              <Typography variant="h4" component="h2" align="center" gutterBottom>
                Room Types & Pricing
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
                Choose from our range of room options designed to meet different needs and budgets.
                All prices include utilities, internet, and basic amenities.
                <Box component="span" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: 'primary.main' }}>
                  Click on any price to book that specific plan
                </Box>
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 6, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        colSpan={2} 
                        align="center" 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          borderRight: 1, 
                          borderColor: 'divider' 
                        }}
                      >
                        ROOM CATEGORY
                      </TableCell>
                      <TableCell 
                        colSpan={3} 
                        align="center" 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          borderRight: 1, 
                          borderColor: 'divider' 
                        }}
                      >
                        WITHOUT FOODING
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem' 
                        }}
                      >
                        WITH FOODING
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell 
                        colSpan={2} 
                        align="center" 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          fontWeight: 'bold',
                          borderRight: 1, 
                          borderColor: 'divider' 
                        }}
                      >
                        STAY DURATION
                      </TableCell>
                      {roomPricingData.stayDurations.slice(0, 3).map((duration) => (
                        <TableCell 
                          key={duration.id} 
                          align="center" 
                          sx={{ 
                            bgcolor: 'primary.light', 
                            fontWeight: 'bold',
                            borderRight: 1, 
                            borderColor: 'divider',
                            whiteSpace: 'normal',
                            width: '16%'
                          }}
                        >
                          {duration.name}
                        </TableCell>
                      ))}
                      <TableCell 
                        align="center" 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          fontWeight: 'bold',
                          whiteSpace: 'normal',
                          width: '16%'
                        }}
                      >
                        {roomPricingData.stayDurations[3].name}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomPricingData.categories.map((category, categoryIndex) => (
                      <React.Fragment key={category.name}>
                        {category.rooms.map((room, roomIndex) => (
                          <TableRow 
                            key={`${category.name}-${room.type}`}
                            sx={{ 
                              '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            {roomIndex === 0 && (
                              <TableCell 
                                rowSpan={category.rooms.length} 
                                align="center"
                                sx={{ 
                                  fontWeight: 'bold', 
                                  bgcolor: 'secondary.light',
                                  borderRight: 1,
                                  borderColor: 'divider',
                                  width: '12%'
                                }}
                              >
                                {category.name}
                              </TableCell>
                            )}
                            <TableCell 
                              align="center"
                              sx={{ 
                                fontWeight: 'bold',
                                borderRight: 1,
                                borderColor: 'divider',
                                width: '12%'
                              }}
                            >
                              {room.type}
                            </TableCell>
                            <TableCell 
                              align="center"
                              onClick={() => handlePriceClick(category.name, room.type, 'shortTerm', room.pricing.shortTerm)}
                              sx={{ 
                                borderRight: 1,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              {room.pricing.shortTerm}
                            </TableCell>
                            <TableCell 
                              align="center"
                              onClick={() => handlePriceClick(category.name, room.type, 'mediumTerm', room.pricing.mediumTerm)}
                              sx={{ 
                                borderRight: 1,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              {room.pricing.mediumTerm}
                            </TableCell>
                            <TableCell 
                              align="center"
                              onClick={() => handlePriceClick(category.name, room.type, 'longTerm', room.pricing.longTerm)}
                              sx={{ 
                                borderRight: 1,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              {room.pricing.longTerm}
                            </TableCell>
                            <TableCell 
                              align="center"
                              onClick={() => handlePriceClick(category.name, room.type, 'withFooding', room.pricing.withFooding)}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              {room.pricing.withFooding}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      component={Link}
                      href="/booking"
                    >
                      Book Now
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large"
                      component={Link}
                      href="/contact"
                    >
                      Contact Us
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}

          {/* Lease Terms Tab */}
          {selectedTab === 1 && (
            <>
              <Typography variant="h4" component="h2" align="center" gutterBottom>
                Lease Terms & Discounts
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
                We offer flexible lease terms to accommodate your needs. Longer commitments come with greater savings.
              </Typography>
              
              <Grid container spacing={4}>
                {leaseTerms.map((term) => (
                  <Grid item xs={12} md={6} key={term.id}>
                    <Paper sx={{ p: 3, height: '100%', boxShadow: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h3">
                          {term.term} Lease
                        </Typography>
                        {term.discount > 0 && (
                          <Chip 
                            label={`${term.discount}% Discount`} 
                            color="success" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                      <Typography variant="body1" paragraph>
                        {term.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Security Deposit
                          </Typography>
                          <Typography variant="body2">
                            {term.securityDeposit}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Cancellation Policy
                          </Typography>
                          <Typography variant="body2">
                            {term.cancellationPolicy}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="body1" paragraph>
                  All lease terms include the same amenities and services. Discounts are applied to the base monthly rent.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  component={Link}
                  href="/contact"
                >
                  Contact Us for Custom Terms
                </Button>
              </Box>
            </>
          )}

          {/* Additional Fees Tab */}
          {selectedTab === 2 && (
            <>
              <Typography variant="h4" component="h2" align="center" gutterBottom>
                Additional Fees & Charges
              </Typography>
              <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
                We believe in transparent pricing with no hidden fees. Here's a comprehensive list of all potential charges.
              </Typography>
              
              <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {additionalFees.map((fee, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', height: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" component="h3">
                              {fee.name}
                            </Typography>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: fee.amount.includes('Included') ? 'success.main' : 'text.primary'
                              }}
                            >
                              {fee.amount}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {fee.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </TableContainer>
              
              <Box sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  All fees are subject to change. Please contact us for the most current information.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  component={Link}
                  href="/contact"
                >
                  Ask About Our Fees
                </Button>
              </Box>
            </>
          )}
        </Container>

        {/* FAQ Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="md">
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
              Common questions about our pricing and policies
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Are utilities included in the rent?
                </Typography>
                <Typography variant="body2" paragraph>
                  Yes, all utilities including water, electricity, heating, and cooling are included in your monthly rent. High-speed internet and basic cable are also included.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Can I change rooms during my lease?
                </Typography>
                <Typography variant="body2" paragraph>
                  Yes, room transfers are possible subject to availability and may involve a transfer fee. Please contact our management team to discuss your specific situation.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Is the security deposit refundable?
                </Typography>
                <Typography variant="body2" paragraph>
                  Yes, your security deposit is fully refundable at the end of your lease term, provided there is no damage to the room beyond normal wear and tear, and all rent and fees are paid.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Do you offer student discounts?
                </Typography>
                <Typography variant="body2" paragraph>
                  Yes, we offer special rates for students with valid ID. We also have group rates for students who want to rent multiple rooms. Contact us for more details on our student packages.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Make Arkedia Homes Your New Home?
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
              Contact us today to schedule a tour or apply for a room. Our team is ready to help you find the perfect living space.
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
                href="/gallery"
              >
                View Rooms
              </Button>
            </Box>
          </Container>
        </Box>
      </>
    </>
  );
}