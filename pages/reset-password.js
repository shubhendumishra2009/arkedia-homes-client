import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Grid, Link as MuiLink, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, loading } = useAuth();
  const router = useRouter();
  const { token } = router.query;
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (!token) {
        throw new Error('Reset token is missing');
      }
      
      await resetPassword({
        token,
        password: values.password
      });
      
      // Redirect to signin page after successful password reset
      router.push('/signin');
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | Arkedia Homes</title>
        <meta name="description" content="Reset your Arkedia Homes account password" />
      </Head>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your new password below
            </Typography>
          </Box>

          {!token ? (
            <Box textAlign="center">
              <Typography variant="body1" color="error" paragraph>
                Invalid or expired password reset link.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href="/forgot-password"
                sx={{ mt: 2 }}
              >
                Request New Reset Link
              </Button>
            </Box>
          ) : (
            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="New Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={handleToggleConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                          'Reset Password'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
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