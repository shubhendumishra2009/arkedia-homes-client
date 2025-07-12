import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function ComplaintsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
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
        // Fetch complaints data
        fetchComplaints();
      }
    }
  }, [user, loading, router]);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockComplaints = [
        {
          id: 1,
          tenant: {
            id: 101,
            name: 'John Doe',
            room_no: '101'
          },
          title: 'Bathroom Sink Leakage',
          description: 'The sink in the bathroom has been leaking for the past two days. Water is accumulating on the floor.',
          created_at: '2023-10-08T14:30:00',
          status: 'pending',
          priority: 'medium',
          admin_response: null,
          resolved_at: null
        },
        {
          id: 2,
          tenant: {
            id: 102,
            name: 'Jane Smith',
            room_no: '202'
          },
          title: 'Noisy Neighbors',
          description: 'The tenants in room 203 are playing loud music late at night. It\'s difficult to sleep.',
          created_at: '2023-10-05T09:15:00',
          status: 'in_progress',
          priority: 'high',
          admin_response: 'We have spoken to the neighbors and reminded them of quiet hours policy.',
          resolved_at: null
        },
        {
          id: 3,
          tenant: {
            id: 103,
            name: 'Mike Johnson',
            room_no: '305'
          },
          title: 'AC Not Cooling Properly',
          description: 'The air conditioner in my room is not cooling properly. It makes noise but doesn\'t cool the room.',
          created_at: '2023-09-25T16:45:00',
          status: 'resolved',
          priority: 'medium',
          admin_response: 'Our maintenance team has fixed the AC unit. The cooling gas was low and has been refilled.',
          resolved_at: '2023-09-27T11:20:00'
        },
        {
          id: 4,
          tenant: {
            id: 104,
            name: 'Sarah Williams',
            room_no: '410'
          },
          title: 'Broken Window Lock',
          description: 'The lock on my window is broken, which is a security concern especially since I\'m on the ground floor.',
          created_at: '2023-10-10T08:30:00',
          status: 'pending',
          priority: 'high',
          admin_response: null,
          resolved_at: null
        }
      ];
      
      setComplaints(mockComplaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch complaints',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setResponseText(complaint.admin_response || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComplaint(null);
    setResponseText('');
  };

  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  const handleSubmitResponse = async () => {
    try {
      // In a real application, this would be an API call
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === selectedComplaint.id ? {
          ...complaint,
          admin_response: responseText,
          status: 'in_progress'
        } : complaint
      );
      
      setComplaints(updatedComplaints);
      setSnackbar({
        open: true,
        message: 'Response submitted successfully',
        severity: 'success'
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting response:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit response',
        severity: 'error'
      });
    }
  };

  const handleMarkAsResolved = async (complaintId) => {
    try {
      // In a real application, this would be an API call
      const updatedComplaints = complaints.map(complaint => 
        complaint.id === complaintId ? {
          ...complaint,
          status: 'resolved',
          resolved_at: new Date().toISOString()
        } : complaint
      );
      
      setComplaints(updatedComplaints);
      setSnackbar({
        open: true,
        message: 'Complaint marked as resolved',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error marking complaint as resolved:', error);
      setSnackbar({
        open: true,
        message: 'Failed to mark complaint as resolved',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityChipColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
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
        <title>Complaints Management | Arkedia Homes</title>
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
            Complaints Management
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.tenant.name}</TableCell>
                    <TableCell>{complaint.tenant.room_no}</TableCell>
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>{formatDate(complaint.created_at).split(',')[0]}</TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.priority}
                        color={getPriorityChipColor(complaint.priority)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status.replace('_', ' ')}
                        color={getStatusChipColor(complaint.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(complaint)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {complaint.status !== 'resolved' && (
                        <IconButton
                          color="success"
                          onClick={() => handleMarkAsResolved(complaint.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Complaint Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tenant
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint?.tenant?.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Room Number
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint?.tenant?.room_no}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date Submitted
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedComplaint?.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                {selectedComplaint && (
                  <Chip
                    label={selectedComplaint.status.replace('_', ' ')}
                    color={getStatusChipColor(selectedComplaint.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Title
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedComplaint?.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedComplaint?.description}
                </Typography>
              </Grid>
              {selectedComplaint?.resolved_at && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Resolved Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedComplaint.resolved_at)}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Admin Response
                </Typography>
                {selectedComplaint?.status === 'resolved' ? (
                  <Typography variant="body1">
                    {selectedComplaint.admin_response || 'No response provided'}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={responseText}
                    onChange={handleResponseChange}
                    placeholder="Enter your response to this complaint"
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedComplaint?.status !== 'resolved' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmitResponse}
              disabled={!responseText.trim()}
            >
              Submit Response
            </Button>
          )}
          {selectedComplaint?.status !== 'resolved' && (
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                handleMarkAsResolved(selectedComplaint.id);
                handleCloseDialog();
              }}
            >
              Mark as Resolved
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}