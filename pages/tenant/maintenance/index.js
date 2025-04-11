import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function MaintenanceRequests() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state for new maintenance request
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    preferred_time: ''
  });

  useEffect(() => {
    // Check if user is authenticated and is a tenant
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'tenant') {
        router.push('/admin/dashboard');
      } else {
        // Fetch maintenance requests data
        fetchRequests();
      }
    }
  }, [user, loading, router]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockRequests = [
        {
          id: 1,
          title: 'Leaking Faucet',
          description: 'The bathroom faucet is leaking continuously and wasting water.',
          created_at: '2023-10-05T10:30:00',
          status: 'scheduled',
          priority: 'medium',
          preferred_time: 'Weekday afternoons',
          scheduled_date: '2023-10-12T14:00:00',
          admin_notes: 'Maintenance team scheduled to fix on Thursday',
          completed_at: null
        },
        {
          id: 2,
          title: 'Light Bulb Replacement',
          description: 'The ceiling light in the bedroom has burned out and needs replacement.',
          created_at: '2023-09-28T16:45:00',
          status: 'completed',
          priority: 'low',
          preferred_time: 'Anytime',
          scheduled_date: '2023-09-30T11:00:00',
          admin_notes: 'Replaced with energy-efficient LED bulb',
          completed_at: '2023-09-30T11:25:00'
        }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch maintenance requests',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleOpenNewDialog = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      preferred_time: ''
    });
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitRequest = async () => {
    try {
      // In a real application, this would be an API call
      const newRequest = {
        id: requests.length + 1,
        ...formData,
        created_at: new Date().toISOString(),
        status: 'pending',
        scheduled_date: null,
        admin_notes: null,
        completed_at: null
      };
      
      setRequests([newRequest, ...requests]);
      setSnackbar({
        open: true,
        message: 'Maintenance request submitted successfully',
        severity: 'success'
      });
      handleCloseNewDialog();
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit maintenance request',
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
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'default';
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
        <title>Maintenance Requests | Arkedia Homes</title>
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
              Maintenance Requests
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenNewDialog}
            >
              New Request
            </Button>
          </Box>

          {requests.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No maintenance requests found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                You haven't submitted any maintenance requests yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenNewDialog}
                sx={{ mt: 2 }}
              >
                Submit Your First Request
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Scheduled Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>{formatDate(request.created_at).split(',')[0]}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.priority}
                          color={getPriorityChipColor(request.priority)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status.replace('_', ' ')}
                          color={getStatusChipColor(request.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>{request.scheduled_date ? formatDate(request.scheduled_date).split(',')[0] : 'Not scheduled'}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(request)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      {/* Maintenance Request Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Maintenance Request Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date Submitted
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedRequest?.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                {selectedRequest && (
                  <Chip
                    label={selectedRequest.status.replace('_', ' ')}
                    color={getStatusChipColor(selectedRequest.status)}
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
                  {selectedRequest?.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Priority
                </Typography>
                {selectedRequest && (
                  <Chip
                    label={selectedRequest.priority}
                    color={getPriorityChipColor(selectedRequest.priority)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Preferred Time
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.preferred_time || 'Not specified'}
                </Typography>
              </Grid>
              {selectedRequest?.scheduled_date && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Scheduled Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedRequest.scheduled_date)}
                  </Typography>
                </Grid>
              )}
              {selectedRequest?.admin_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Admin Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.admin_notes}
                  </Typography>
                </Grid>
              )}
              {selectedRequest?.completed_at && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Completed Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedRequest.completed_at)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Maintenance Request Dialog */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Maintenance Request</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Title"
                  fullWidth
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Brief description of the issue"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Please provide detailed information about the maintenance issue"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="preferred_time"
                  label="Preferred Time for Maintenance"
                  fullWidth
                  value={formData.preferred_time}
                  onChange={handleInputChange}
                  placeholder="E.g., Weekday mornings, Weekends, etc."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitRequest} 
            variant="contained" 
            color="primary"
            disabled={!formData.title.trim() || !formData.description.trim()}
          >
            Submit
          </Button>
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