import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Card, CardContent, CardHeader, Button, Divider, List, ListItem, ListItemText, ListItemIcon, CircularProgress, Chip } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import ConstructionIcon from '@mui/icons-material/Construction';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

// Room Details Component
const RoomDetails = ({ room }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Your Room" />
    <Divider />
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Room Number
          </Typography>
          <Typography variant="body1">{room.room_no}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Room Type
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {room.room_type}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Floor
          </Typography>
          <Typography variant="body1">{room.floor}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Area
          </Typography>
          <Typography variant="body1">{room.area_sqft} sq.ft</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Rent Amount
          </Typography>
          <Typography variant="body1">₹{room.base_rent}/month</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {room.is_furnished && (
              <Chip label="Furnished" size="small" color="primary" variant="outlined" />
            )}
            {room.has_ac && (
              <Chip label="AC" size="small" color="primary" variant="outlined" />
            )}
            {room.has_balcony && (
              <Chip label="Balcony" size="small" color="primary" variant="outlined" />
            )}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Payment Status Component
const PaymentStatus = ({ payment }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Rent Payment Status" />
    <Divider />
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Current Month
          </Typography>
          <Typography variant="body1">{payment.currentMonth}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Status
          </Typography>
          <Chip
            label={payment.status}
            size="small"
            color={payment.status === 'Paid' ? 'success' : 'error'}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Amount
          </Typography>
          <Typography variant="body1">₹{payment.amount}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Due Date
          </Typography>
          <Typography variant="body1">{payment.dueDate}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PaymentIcon />}
            disabled={payment.status === 'Paid'}
            onClick={() => alert('Payment functionality will be implemented soon!')}
          >
            {payment.status === 'Paid' ? 'Already Paid' : 'Pay Now'}
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Recent Notices Component
const RecentNotices = ({ notices }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Recent Notices" />
    <Divider />
    <List sx={{ p: 0 }}>
      {notices.length > 0 ? (
        notices.map((notice, index) => (
          <ListItem divider={index < notices.length - 1} key={index}>
            <ListItemText
              primary={notice.title}
              secondary={notice.date}
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No recent notices" />
        </ListItem>
      )}
    </List>
  </Card>
);

// Recent Complaints Component
const RecentComplaints = ({ complaints }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader 
      title="Recent Complaints" 
      action={
        <Button 
          size="small" 
          variant="outlined"
          onClick={() => alert('New complaint form will be implemented soon!')}
        >
          New
        </Button>
      }
    />
    <Divider />
    <List sx={{ p: 0 }}>
      {complaints.length > 0 ? (
        complaints.map((complaint, index) => (
          <ListItem divider={index < complaints.length - 1} key={index}>
            <ListItemIcon>
              <WarningIcon color={complaint.status === 'Resolved' ? 'success' : 'warning'} />
            </ListItemIcon>
            <ListItemText
              primary={complaint.title}
              secondary={
                <>
                  <Typography variant="caption" display="block">
                    {complaint.date}
                  </Typography>
                  <Chip 
                    label={complaint.status} 
                    size="small" 
                    color={complaint.status === 'Resolved' ? 'success' : 'warning'}
                    sx={{ mt: 0.5 }}
                  />
                </>
              }
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No recent complaints" />
        </ListItem>
      )}
    </List>
  </Card>
);

export default function TenantDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [payment, setPayment] = useState(null);
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is a tenant
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'tenant') {
        router.push('/admin/dashboard');
      } else {
        // Fetch tenant data
        fetchTenantData();
      }
    }
  }, [user, loading, router]);

  const fetchTenantData = async () => {
    setIsLoading(true);
    try {
      // In a real application, these would be API calls
      // For now, we'll use mock data
      
      // Mock room data
      setRoom({
        room_no: '101',
        room_type: 'deluxe',
        floor: 1,
        area_sqft: 350,
        base_rent: 1200,
        is_furnished: true,
        has_ac: true,
        has_balcony: false
      });

      // Mock payment data
      setPayment({
        currentMonth: 'October 2023',
        status: 'Paid',
        amount: 1200,
        dueDate: '5th October 2023',
        paidOn: '3rd October 2023'
      });

      // Mock notices data
      setNotices([
        {
          title: 'Scheduled Maintenance: Water Supply Interruption',
          date: 'October 15, 2023'
        },
        {
          title: 'New Gym Equipment Installation',
          date: 'October 10, 2023'
        },
        {
          title: 'Building Security Update',
          date: 'October 5, 2023'
        }
      ]);

      // Mock complaints data
      setComplaints([
        {
          title: 'Bathroom Sink Leakage',
          date: 'October 8, 2023',
          status: 'In Progress'
        },
        {
          title: 'AC Not Cooling Properly',
          date: 'September 25, 2023',
          status: 'Resolved'
        }
      ]);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setIsLoading(false);
    }
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
    <Layout>
      <Head>
        <title>Tenant Dashboard | Arkedia Homes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Tenant Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {/* Room Details */}
              <Grid item xs={12} md={6}>
                <RoomDetails room={room} />
              </Grid>

              {/* Payment Status */}
              <Grid item xs={12} md={6}>
                <PaymentStatus payment={payment} />
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Quick Actions" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<ReceiptIcon />}
                          onClick={() => router.push('/tenant/payments')}
                        >
                          Payment History
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<ConstructionIcon />}
                          onClick={() => router.push('/tenant/maintenance')}
                        >
                          Maintenance Request
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<WarningIcon />}
                          onClick={() => router.push('/tenant/complaints')}
                        >
                          Submit Complaint
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Notices */}
              <Grid item xs={12} md={6}>
                <RecentNotices notices={notices} />
              </Grid>

              {/* Recent Complaints */}
              <Grid item xs={12} md={6}>
                <RecentComplaints complaints={complaints} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}