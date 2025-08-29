import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Head>
        <title>Terms and Conditions - Arkedia Homes</title>
        <meta name="description" content="Arkedia Homes Terms and Conditions" />
      </Head>

      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Terms and Conditions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated: August 29, 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            By using ArkediaHomes, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using our services.
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            2. Services Provided
          </Typography>
          <Typography variant="body1" paragraph>
            ArkediaHomes provides the following services:
          </Typography>
          <ul>
            <li>PG (Paying Guest) aggregation and booking platform</li>
            <li>Online rent collection and management tools</li>
            <li>Comprehensive property management services</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            3. User Accounts
          </Typography>
          <ul>
            <li>All users must provide valid and accurate personal details during registration</li>
            <li>Property owners must submit valid property documents and government-issued identification</li>
            <li>Providing false information may result in immediate account suspension or termination</li>
            <li>Users are responsible for maintaining the confidentiality of their account credentials</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            4. Bookings & Payments
          </Typography>
          <ul>
            <li>Bookings are considered confirmed only upon successful payment</li>
            <li>ArkediaHomes charges service/commission fees as specified at the time of booking</li>
            <li>Refunds and cancellations are subject to our cancellation policy</li>
            <li>All payments must be made through our secure payment gateway</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            5. Responsibilities
          </Typography>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Tenants:
          </Typography>
          <ul>
            <li>Must adhere to all property rules and regulations</li>
            <li>Are responsible for timely rent payments</li>
            <li>Must maintain the property in good condition</li>
          </ul>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Property Owners:
          </Typography>
          <ul>
            <li>Must maintain the property in habitable condition</li>
            <li>Must provide all promised amenities and services</li>
            <li>Must respect tenant privacy and provide proper notice for property access</li>
          </ul>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            ArkediaHomes:
          </Typography>
          <ul>
            <li>Facilitates bookings and payment processing</li>
            <li>Provides a platform for communication between parties</li>
            <li>Offers dispute resolution services when needed</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            ArkediaHomes shall not be liable for:
          </Typography>
          <ul>
            <li>Any theft or damage to personal property</li>
            <li>Disputes between tenants and property owners</li>
            <li>Any damages arising from the use or inability to use our services</li>
            <li>Inaccuracies in property listings or descriptions</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            7. Termination
          </Typography>
          <ul>
            <li>ArkediaHomes reserves the right to suspend or terminate accounts that violate these terms</li>
            <li>Users may terminate their account at any time by contacting customer support</li>
            <li>Certain provisions of these terms will survive termination</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            8. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in [Your City], India.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 4, fontStyle: 'italic' }}>
            If you have any questions about these Terms and Conditions, please contact us at support@arkediahomes.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;
