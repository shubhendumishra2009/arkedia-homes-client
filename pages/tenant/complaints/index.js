import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Snackbar, Alert,FormControl,InputLabel } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function TenantComplaints() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state for new complaint
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    // Check if user is authenticated and is a tenant
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'tenant') {
        router.push('/admin/dashboard');
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
          title: 'AC Not Cooling Properly',
          description: 'The air conditioner in my room is not cooling properly. It makes noise but doesn\'t cool the room.',
          created_at: '2023-09-25T16:45:00',
          status: 'resolved',
          priority: 'medium',
          admin_response: 'Our maintenance team has fixed the AC unit. The cooling gas was low and has been refilled.',
          resolved_at: '2023-09-27T11:20:00'
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComplaint(null);
  };

  const handleOpenNewDialog = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium'
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

  const handleSubmitComplaint = async () => {
    try {
      // In a real application, this would be an API call
      const newComplaint = {
        id: complaints.length + 1,
        ...formData,
        created_at: new Date().toISOString(),
        status: 'pending',
        admin_response: null,
        resolved_at: null
      };
      
      setComplaints([newComplaint, ...complaints]);
      setSnackbar({
        open: true,
        message: 'Complaint submitted successfully',
        severity: 'success'
      });
      handleCloseNewDialog();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit complaint',
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
        <title>My Complaints | Arkedia Homes</title>
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
              My Complaints
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenNewDialog}
            >
              Submit New Complaint
            </Button>
          </Box>

          {complaints.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No complaints found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                You haven't submitted any complaints yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenNewDialog}
                sx={{ mt: 2 }}
              >
                Submit Your First Complaint
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
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      {/* Complaint Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
              {selectedComplaint?.admin_response && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Admin Response
                  </Typography>
                  <Typography variant="body1">
                    {selectedComplaint.admin_response}
                  </Typography>
                </Grid>
              )}
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Complaint Dialog */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Complaint</DialogTitle>
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
                  placeholder="Please provide detailed information about your complaint"
                />
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitComplaint} 
            variant="contained" 
            color="primary"
            disabled={!formData.title.trim() || !formData.description.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
