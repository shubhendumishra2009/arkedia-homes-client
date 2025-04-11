import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Link as MuiLink, CircularProgress } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ForgotPassword() {
  const { forgotPassword, loading } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | Arkedia Homes</title>
        <meta name="description" content="Reset your Arkedia Homes account password" />
      </Head>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {!submitted 
                ? 'Enter your email address to receive password reset instructions'
                : 'Check your email for password reset instructions'}
            </Typography>
          </Box>

          {!submitted ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting || loading}
                        sx={{ py: 1.5 }}
                      >
                        {(isSubmitting || loading) ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Send Reset Instructions'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          ) : (
            <Box textAlign="center">
              <Typography variant="body1" paragraph>
                If your email is registered with us, you will receive password reset instructions shortly.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href="/signin"
                sx={{ mt: 2 }}
              >
                Return to Sign In
              </Button>
            </Box>
          )}

          <Box mt={4} textAlign="center">
            <Typography variant="body2">
              Remember your password?{' '}
              <MuiLink
                component={Link}
                href="/signin"
                sx={{ textDecoration: 'none' }}
              >
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}