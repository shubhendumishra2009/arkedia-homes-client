import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Card, CardContent, CardHeader, Button, Divider, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

// Dashboard Stats Component
const DashboardStat = ({ title, value, icon, color }) => (
  <div className={styles.statCard}>
    <div>
      <div className={styles.statLabel}>{title}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
    <div className={color === '#2E5077' ? styles.statIconBlue : color === '#4ECDC4' ? styles.statIconGreen : styles.statIconOrange}>
      {icon}
    </div>
  </div>
);

// Recent Activity Component
const RecentActivity = ({ activities }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Recent Activity" />
    <Divider />
    <List>
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <ListItem divider={index < activities.length - 1} key={index}>
            <ListItemIcon>
              {activity.type === 'payment' && <PaymentIcon />}
              {activity.type === 'complaint' && <WarningIcon />}
              {activity.type === 'notice' && <AnnouncementIcon />}
              {activity.type === 'feedback' && <FeedbackIcon />}
            </ListItemIcon>
            <ListItemText
              primary={activity.title}
              secondary={activity.timestamp}
            />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No recent activities" />
        </ListItem>
      )}
    </List>
    <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingComplaints: 0,
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch dashboard data
        fetchDashboardData();
      }
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real application, these would be API calls
      // For now, we'll use mock data
      
      // Mock stats data
      setStats({
        totalTenants: 24,
        totalRooms: 30,
        occupiedRooms: 24,
        pendingComplaints: 3,
      });

      // Mock activities data
      setActivities([
        {
          type: 'payment',
          title: 'New rent payment received from John Doe',
          timestamp: '2 hours ago'
        },
        {
          type: 'complaint',
          title: 'New complaint submitted by Jane Smith',
          timestamp: '5 hours ago'
        },
        {
          type: 'notice',
          title: 'Maintenance notice sent to all tenants',
          timestamp: '1 day ago'
        },
        {
          type: 'feedback',
          title: 'New feedback received from Mike Johnson',
          timestamp: '2 days ago'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
    <>
      <Head>
        <title>Admin Dashboard | Arkedia Homes</title>
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
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <DashboardStat
                  title="TOTAL TENANTS"
                  value={stats.totalTenants}
                  icon={<PeopleIcon />}
                  color="#3f51b5"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardStat
                  title="TOTAL ROOMS"
                  value={stats.totalRooms}
                  icon={<HomeIcon />}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardStat
                  title="OCCUPIED ROOMS"
                  value={stats.occupiedRooms}
                  icon={<HomeIcon />}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardStat
                  title="PENDING COMPLAINTS"
                  value={stats.pendingComplaints}
                  icon={<WarningIcon />}
                  color="#f44336"
                />
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <RecentActivity activities={activities} />
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Quick Actions" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<PeopleIcon />}
                          onClick={() => router.push('/admin/tenants')}
                        >
                          Manage Tenants
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<HomeIcon />}
                          onClick={() => router.push('/admin/rooms')}
                        >
                          Manage Rooms
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<PaymentIcon />}
                          onClick={() => router.push('/admin/payments')}
                        >
                          View Payments
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<WarningIcon />}
                          onClick={() => router.push('/admin/complaints')}
                        >
                          View Complaints
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
   </>
  );
}