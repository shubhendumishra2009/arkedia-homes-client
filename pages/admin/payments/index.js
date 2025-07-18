import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function PaymentsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch payments data
        fetchPayments();
      }
    }
  }, [user, loading, router]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockPayments = [
        {
          id: 1,
          tenant: {
            id: 101,
            name: 'John Doe',
            room_no: '101'
          },
          amount: 800,
          payment_date: '2023-10-03T10:15:00',
          due_date: '2023-10-05T00:00:00',
          payment_method: 'credit_card',
          transaction_id: 'txn_1234567890',
          status: 'paid',
          month: 'October 2023',
          notes: 'Regular monthly payment'
        },
        {
          id: 2,
          tenant: {
            id: 102,
            name: 'Jane Smith',
            room_no: '202'
          },
          amount: 1800,
          payment_date: '2023-10-08T14:30:00',
          due_date: '2023-10-10T00:00:00',
          payment_method: 'bank_transfer',
          transaction_id: 'bt_9876543210',
          status: 'paid',
          month: 'October 2023',
          notes: 'Paid with 2-day delay fee waived'
        },
        {
          id: 3,
          tenant: {
            id: 103,
            name: 'Mike Johnson',
            room_no: '305'
          },
          amount: 1200,
          payment_date: null,
          due_date: '2023-10-05T00:00:00',
          payment_method: null,
          transaction_id: null,
          status: 'overdue',
          month: 'October 2023',
          notes: 'Reminder sent on Oct 7'
        },
        {
          id: 4,
          tenant: {
            id: 104,
            name: 'Sarah Williams',
            room_no: '410'
          },
          amount: 1500,
          payment_date: '2023-09-30T09:45:00',
          due_date: '2023-10-01T00:00:00',
          payment_method: 'cash',
          transaction_id: 'cash_receipt_12345',
          status: 'paid',
          month: 'October 2023',
          notes: 'Paid in advance'
        },
        {
          id: 5,
          tenant: {
            id: 101,
            name: 'John Doe',
            room_no: '101'
          },
          amount: 800,
          payment_date: '2023-09-04T11:20:00',
          due_date: '2023-09-05T00:00:00',
          payment_method: 'credit_card',
          transaction_id: 'txn_0987654321',
          status: 'paid',
          month: 'September 2023',
          notes: 'Regular monthly payment'
        },
        {
          id: 6,
          tenant: {
            id: 102,
            name: 'Jane Smith',
            room_no: '202'
          },
          amount: 1800,
          payment_date: '2023-09-10T16:05:00',
          due_date: '2023-09-10T00:00:00',
          payment_method: 'bank_transfer',
          transaction_id: 'bt_1122334455',
          status: 'paid',
          month: 'September 2023',
          notes: 'Paid on due date'
        }
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch payments',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (payment) => {
    setSelectedPayment(payment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPaymentMethod = (method) => {
    if (!method) return 'N/A';
    return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <>
      {/* Layout content */}
      <Head>
        <title>Payments Management | Arkedia Homes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">
              Payments Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReceiptIcon />}
              onClick={() => alert('Generate report functionality will be implemented soon!')}
            >
              Generate Report
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.tenant.name}</TableCell>
                    <TableCell>{payment.tenant.room_no}</TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>{formatDate(payment.due_date).split(',')[0]}</TableCell>
                    <TableCell>{formatDate(payment.payment_date).split(',')[0]}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusChipColor(payment.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(payment)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Payment Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tenant
                </Typography>
                <Typography variant="body1">
                  {selectedPayment?.tenant?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Room Number
                </Typography>
                <Typography variant="body1">
                  {selectedPayment?.tenant?.room_no}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Month
                </Typography>
                <Typography variant="body1">
                  {selectedPayment?.month}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="body1">
                  ₹{selectedPayment?.amount}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedPayment?.due_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedPayment?.payment_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {formatPaymentMethod(selectedPayment?.payment_method)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1">
                  {selectedPayment?.transaction_id || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={selectedPayment?.status}
                  color={getStatusChipColor(selectedPayment?.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">
                  {selectedPayment?.notes || 'No notes'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedPayment?.status === 'paid' && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<ReceiptIcon />}
              onClick={() => alert('Receipt download functionality will be implemented soon!')}
            >
              Download Receipt
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
