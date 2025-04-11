import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Grid, CircularProgress, Snackbar, Alert, MenuItem, FormControl, InputLabel, Select, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function PurchaseList() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDateType, setFilterDateType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
const [openAddDialog, setOpenAddDialog] = useState(false);
const [newProcurement, setNewProcurement] = useState({
  item_name: '',
  vendor: '',
  amount: '',
  purchase_date: new Date().toISOString().split('T')[0],
  category: '',
  payment_method: '',
  invoice_number: '',
  status: 'required',
  priority: 'medium',
  notes: ''
});

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch purchases data
        fetchPurchases();
      }
    }
  }, [user, loading, router]);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockPurchases = [
        {
          id: 1,
          item_name: 'Cleaning Supplies',
          vendor: 'CleanMax Store',
          amount: 5000,
          purchase_date: '2023-10-05T00:00:00',
          category: 'cleaning',
          payment_method: 'cash',
          invoice_number: 'INV-001',
          status: 'completed',
          notes: 'Monthly cleaning supplies',
          created_at: '2023-10-05T10:30:00'
        },
        {
          id: 2,
          item_name: 'Office Stationery',
          vendor: 'Office Depot',
          amount: 3500,
          purchase_date: '2023-10-07T00:00:00',
          category: 'office',
          payment_method: 'credit_card',
          invoice_number: 'INV-002',
          status: 'completed',
          notes: 'Paper, pens, and other office supplies',
          created_at: '2023-10-07T14:15:00'
        },
        {
          id: 3,
          item_name: 'Refrigerator',
          vendor: 'Electronics World',
          amount: 35000,
          purchase_date: '2023-10-10T00:00:00',
          category: 'electronics',
          payment_method: 'bank_transfer',
          invoice_number: 'INV-003',
          status: 'completed',
          notes: 'New refrigerator for common area',
          created_at: '2023-10-10T09:45:00'
        },
        {
          id: 4,
          item_name: 'Groceries',
          vendor: 'SuperMart',
          amount: 8000,
          purchase_date: '2023-10-12T00:00:00',
          category: 'groceries',
          payment_method: 'cash',
          invoice_number: 'INV-004',
          status: 'completed',
          notes: 'Weekly groceries for staff',
          created_at: '2023-10-12T11:20:00'
        },
        {
          id: 5,
          item_name: 'Maintenance Tools',
          vendor: 'Hardware Plus',
          amount: 12000,
          purchase_date: '2023-10-15T00:00:00',
          category: 'maintenance',
          payment_method: 'credit_card',
          invoice_number: 'INV-005',
          status: 'completed',
          notes: 'Tools for maintenance staff',
          created_at: '2023-10-15T16:30:00'
        },
        {
          id: 6,
          item_name: 'Furniture',
          vendor: 'Home Furnishings',
          amount: 25000,
          purchase_date: '2023-10-18T00:00:00',
          category: 'furniture',
          payment_method: 'bank_transfer',
          invoice_number: 'INV-006',
          status: 'required',
    priority: 'high',
          notes: 'New sofa for lobby',
          created_at: '2023-10-18T13:10:00'
        }
      ];
      
      setPurchases(mockPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch purchases',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'month') {
      setFilterMonth(value);
    } else if (name === 'category') {
      setFilterCategory(value);
    } else if (name === 'status') {
      setFilterStatus(value);
    } else if (name === 'priority') {
      setFilterPriority(value);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    let matchesMonth = true;
    let matchesCategory = true;
    let matchesStatus = true;
    let matchesPriority = true;

    if (filterMonth) {
      const purchaseMonth = new Date(purchase.purchase_date).getMonth() + 1;
      const purchaseYear = new Date(purchase.purchase_date).getFullYear();
      const [year, month] = filterMonth.split('-');
      matchesMonth = purchaseMonth === parseInt(month) && purchaseYear === parseInt(year);
    }

    if (filterCategory) {
      matchesCategory = purchase.category === filterCategory;
    }

    if (filterStatus) {
      matchesStatus = purchase.status === filterStatus;
    }

    if (filterPriority) {
      matchesPriority = purchase.priority === filterPriority;
    }

    return matchesMonth && matchesCategory && matchesStatus && matchesPriority;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      groceries: 'Groceries',
      maintenance: 'Maintenance',
      utilities: 'Utilities',
      furniture: 'Furniture',
      electronics: 'Electronics',
      cleaning: 'Cleaning',
      office: 'Office',
      other: 'Other'
    };
    return categories[category] || 'Unknown';
  };

  // Group purchases by category
  const purchasesByCategory = {};
  filteredPurchases.forEach(purchase => {
    if (!purchasesByCategory[purchase.category]) {
      purchasesByCategory[purchase.category] = [];
    }
    purchasesByCategory[purchase.category].push(purchase);
  });

  // Calculate total amount by category
  const totalByCategory = {};
  Object.keys(purchasesByCategory).forEach(category => {
    totalByCategory[category] = purchasesByCategory[category].reduce(
      (total, purchase) => total + Number(purchase.amount), 0
    );
  });

  // Calculate grand total
  const grandTotal = filteredPurchases.reduce(
    (total, purchase) => total + Number(purchase.amount), 0
  );

  const handleViewPurchase = (id) => {
    router.push(`/admin/purchases?id=${id}`);
  };

  return (
    <>
      <Head>
        <title>Purchase List | Arkedia Homes</title>
      </Head>
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.pageHeader}>
          <Typography variant="h4" component="h1" gutterBottom>
            Purchase List
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
            startIcon={<AddIcon />}
          >
            Add Procurement
          </Button>
        </Box>

        <Paper className={styles.filterSection}>
          <Box display="flex" alignItems="center" p={2}>
            <FilterListIcon sx={{ mr: 2 }} />
            <Typography variant="subtitle1" sx={{ mr: 3 }}>
              Filters:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Month"
                  type="month"
                  name="month"
                  value={filterMonth}
                  onChange={handleFilterChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filterStatus}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="required">Required</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="ordered">Ordered</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={filterPriority}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    name="category"
                    value={filterCategory}
                    onChange={handleFilterChange}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="groceries">Groceries</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="utilities">Utilities</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Card */}
            <Card sx={{ mb: 3, mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Purchase Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">
                      Total Purchases: {filteredPurchases.length}
                    </Typography>
                    <Typography variant="subtitle1">
                      Grand Total: {formatCurrency(grandTotal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Breakdown by Category:
                    </Typography>
                    {Object.keys(totalByCategory).map(category => (
                      <Typography key={category} variant="body2">
                        {getCategoryLabel(category)}: {formatCurrency(totalByCategory[category])}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Purchase List Table */}
            {filteredPurchases.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.item_name}</TableCell>
                        <TableCell>{purchase.vendor}</TableCell>
                        <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                        <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={getCategoryLabel(purchase.category)} />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={purchase.status} 
                            size="small" 
                            sx={{ 
                              backgroundColor: purchase.status === 'required' ? 'error.light' : 
                                           purchase.status === 'pending' ? 'warning.light' : 
                                           purchase.status === 'ordered' ? 'info.light' : 'success.light',
                              color: 'white'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          {purchase.priority && (
                            <Chip 
                              label={purchase.priority} 
                              size="small" 
                              sx={{ 
                                backgroundColor: purchase.priority === 'high' ? 'error.main' : 
                                             purchase.priority === 'medium' ? 'warning.main' : 'success.main',
                                color: 'white'
                              }} 
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleViewPurchase(purchase.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography>No purchases found matching the filters</Typography>
              </Paper>
            )}
          </>
        )}

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

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>New Procurement</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Item Name"
                  fullWidth
                  required
                  value={newProcurement.item_name}
                  onChange={(e) => setNewProcurement({...newProcurement, item_name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Vendor"
                  fullWidth
                  required
                  value={newProcurement.vendor}
                  onChange={(e) => setNewProcurement({...newProcurement, vendor: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  required
                  value={newProcurement.amount}
                  onChange={(e) => setNewProcurement({...newProcurement, amount: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={newProcurement.purchase_date}
                  onChange={(e) => setNewProcurement({...newProcurement, purchase_date: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newProcurement.category}
                    onChange={(e) => setNewProcurement({...newProcurement, category: e.target.value})}
                    label="Category"
                  >
                    <MenuItem value="groceries">Groceries</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="utilities">Utilities</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newProcurement.status}
                    onChange={(e) => setNewProcurement({...newProcurement, status: e.target.value})}
                    label="Status"
                  >
                    <MenuItem value="required">Required</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="ordered">Ordered</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newProcurement.priority}
                    onChange={(e) => setNewProcurement({...newProcurement, priority: e.target.value})}
                    label="Priority"
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={newProcurement.payment_method}
                    onChange={(e) => setNewProcurement({...newProcurement, payment_method: e.target.value})}
                    label="Payment Method"
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="debit_card">Debit Card</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  value={newProcurement.notes}
                  onChange={(e) => setNewProcurement({...newProcurement, notes: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setPurchases([...purchases, {
                  ...newProcurement,
                  id: purchases.length + 1,
                  created_at: new Date().toISOString()
                }]);
                setOpenAddDialog(false);
                setSnackbar({
                  open: true,
                  message: 'Procurement added successfully',
                  severity: 'success'
                });
                setNewProcurement({
                  item_name: '',
                  vendor: '',
                  amount: '',
                  purchase_date: new Date().toISOString().split('T')[0],
                  category: '',
                  payment_method: '',
                  invoice_number: '',
                  status: 'required',
                  priority: 'medium',
                  notes: ''
                });
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}