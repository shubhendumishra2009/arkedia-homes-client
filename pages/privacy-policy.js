import React from 'react';
import Head from 'next/head';
import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Head>
        <title>Privacy Policy - Arkedia Homes</title>
        <meta name="description" content="Arkedia Homes Privacy Policy" />
      </Head>

      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated: August 29, 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect the following types of information to provide and improve our services:
          </Typography>
          <ul>
            <li>Personal details: name, contact information, and identification proofs</li>
            <li>Booking and payment information</li>
            <li>Property details from property owners</li>
            <li>Device and IP usage data for analytics and security</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            2. Use of Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the collected information to:
          </Typography>
          <ul>
            <li>Process bookings and payments</li>
            <li>Verify property owners and tenants</li>
            <li>Send important updates and promotional offers</li>
            <li>Enhance and improve our platform</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            3. Data Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We may share your information with:
          </Typography>
          <ul>
            <li>Property owners/tenants for confirmed bookings</li>
            <li>Trusted service providers for payments and verification</li>
            <li>We do not sell your personal information to third parties</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            4. Security
          </Typography>
          <Typography variant="body1" paragraph>
            We take your data security seriously and implement measures including:
          </Typography>
          <ul>
            <li>Encrypted payment processing</li>
            <li>Secure document storage</li>
            <li>Restricted staff access to sensitive information</li>
          </ul>

          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            For any privacy-related inquiries or to exercise your rights, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Email: support@arkediahomes.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
