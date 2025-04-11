import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Snackbar, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';

export default function PurchasesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    item_name: '',
    vendor: '',
    amount: '',
    purchase_date: '',
    category: '',
    payment_method: '',
    invoice_number: '',
    status: 'completed',
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
  }, [user, loading, router, period, year, month, startDate, endDate]);

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
          status: 'pending',
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

  const handleOpenViewDialog = (purchase) => {
    setSelectedPurchase(purchase);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedPurchase(null);
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setFormData({
      item_name: '',
      vendor: '',
      amount: '',
      purchase_date: '',
      category: '',
      payment_method: '',
      invoice_number: '',
      status: 'completed',
      notes: ''
    });
    setOpenAddEditDialog(true);
  };

  const handleOpenEditDialog = (purchase) => {
    setIsEditing(true);
    setFormData({
      item_name: purchase.item_name,
      vendor: purchase.vendor,
      amount: purchase.amount,
      purchase_date: purchase.purchase_date.split('T')[0], // Format date for input field
      category: purchase.category,
      payment_method: purchase.payment_method,
      invoice_number: purchase.invoice_number,
      status: purchase.status,
      notes: purchase.notes
    });
    setSelectedPurchase(purchase);
    setOpenAddEditDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
    setSelectedPurchase(null);
  };

  const handleOpenDeleteDialog = (purchase) => {
    setSelectedPurchase(purchase);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPurchase(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.item_name || !formData.vendor || !formData.amount || !formData.purchase_date || !formData.category) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    // In a real application, this would be an API call to save the data
    if (isEditing) {
      // Update existing purchase
      const updatedPurchases = purchases.map(purchase => {
        if (purchase.id === selectedPurchase.id) {
          return {
            ...purchase,
            ...formData,
            amount: Number(formData.amount)
          };
        }
        return purchase;
      });
      setPurchases(updatedPurchases);
      setSnackbar({
        open: true,
        message: 'Purchase updated successfully',
        severity: 'success'
      });
    } else {
      // Add new purchase
      const newPurchase = {
        id: Math.max(...purchases.map(p => p.id)) + 1,
        ...formData,
        amount: Number(formData.amount),
        created_at: new Date().toISOString()
      };
      setPurchases([newPurchase, ...purchases]);
      setSnackbar({
        open: true,
        message: 'Purchase added successfully',
        severity: 'success'
      });
    }

    handleCloseAddEditDialog();
  };

  const handleDelete = () => {
    // In a real application, this would be an API call to delete the data
    const updatedPurchases = purchases.filter(purchase => purchase.id !== selectedPurchase.id);
    setPurchases(updatedPurchases);
    setSnackbar({
      open: true,
      message: 'Purchase deleted successfully',
      severity: 'success'
    });
    handleCloseDeleteDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'category') {
      setFilterCategory(value);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    let matchesDate = true;
    let matchesCategory = true;
    const purchaseDate = new Date(purchase.purchase_date);

    if (period === 'monthly') {
      const purchaseMonth = purchaseDate.getMonth();
      const purchaseYear = purchaseDate.getFullYear();
      matchesDate = purchaseMonth === month && purchaseYear === year;
    } else if (period === 'quarterly') {
      const purchaseMonth = purchaseDate.getMonth();
      const purchaseYear = purchaseDate.getFullYear();
      const quarter = Math.floor(month / 3);
      const purchaseQuarter = Math.floor(purchaseMonth / 3);
      matchesDate = purchaseQuarter === quarter && purchaseYear === year;
    } else if (period === 'yearly') {
      const purchaseYear = purchaseDate.getFullYear();
      matchesDate = purchaseYear === year;
    } else if (period === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      matchesDate = purchaseDate >= start && purchaseDate <= end;
    }

    if (filterCategory) {
      matchesCategory = purchase.category === filterCategory;
    }

    return matchesDate && matchesCategory;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      check: 'Check',
      online: 'Online',
      other: 'Other'
    };
    return methods[method] || 'Unknown';
  };

  return (
    <>
      <Head>
        <title>Purchases Management | Arkedia Homes</title>
      </Head>
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.pageHeader}>
          <Typography variant="h4" component="h1" gutterBottom>
            Purchases Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add New Purchase
          </Button>
        </Box>

        <Paper className={styles.filterSection}>
          <Box display="flex" alignItems="center" p={2}>
            <FilterListIcon sx={{ mr: 2 }} />
            <Typography variant="subtitle1" sx={{ mr: 3 }}>
              Filters:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={period}
                    label="Period"
                    onChange={handlePeriodChange}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {period !== 'custom' && (
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={year}
                      label="Year"
                      onChange={handleYearChange}
                    >
                      <MenuItem value={2023}>2023</MenuItem>
                      <MenuItem value={2022}>2022</MenuItem>
                      <MenuItem value={2021}>2021</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              {period === 'monthly' && (
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={month}
                      label="Month"
                      onChange={handleMonthChange}
                    >
                      <MenuItem value={0}>January</MenuItem>
                      <MenuItem value={1}>February</MenuItem>
                      <MenuItem value={2}>March</MenuItem>
                      <MenuItem value={3}>April</MenuItem>
                      <MenuItem value={4}>May</MenuItem>
                      <MenuItem value={5}>June</MenuItem>
                      <MenuItem value={6}>July</MenuItem>
                      <MenuItem value={7}>August</MenuItem>
                      <MenuItem value={8}>September</MenuItem>
                      <MenuItem value={9}>October</MenuItem>
                      <MenuItem value={10}>November</MenuItem>
                      <MenuItem value={11}>December</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              {period === 'custom' && (
                <>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="category-filter-label">Category</InputLabel>
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

        <Paper className={styles.tableContainer}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.id}</TableCell>
                        <TableCell>{purchase.item_name}</TableCell>
                        <TableCell>{purchase.vendor}</TableCell>
                        <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                        <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={getCategoryLabel(purchase.category)} />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)} 
                            color={getStatusColor(purchase.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenViewDialog(purchase)}
                            title="View Details"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleOpenEditDialog(purchase)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(purchase)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No purchases found matching the filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* View Purchase Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>Purchase Details</DialogTitle>
          <DialogContent dividers>
            {selectedPurchase && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Item Name</Typography>
                  <Typography variant="body1" gutterBottom>{selectedPurchase.item_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Vendor</Typography>
                  <Typography variant="body1" gutterBottom>{selectedPurchase.vendor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Amount</Typography>
                  <Typography variant="body1" gutterBottom>{formatCurrency(selectedPurchase.amount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Purchase Date</Typography>
                  <Typography variant="body1" gutterBottom>{new Date(selectedPurchase.purchase_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography variant="body1" gutterBottom>{getCategoryLabel(selectedPurchase.category)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Payment Method</Typography>
                  <Typography variant="body1" gutterBottom>{getPaymentMethodLabel(selectedPurchase.payment_method)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Invoice Number</Typography>
                  <Typography variant="body1" gutterBottom>{selectedPurchase.invoice_number || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip 
                    label={selectedPurchase.status.charAt(0).toUpperCase() + selectedPurchase.status.slice(1)} 
                    color={getStatusColor(selectedPurchase.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Notes</Typography>
                  <Typography variant="body1" gutterBottom>{selectedPurchase.notes || 'No notes'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Created At</Typography>
                  <Typography variant="body1" gutterBottom>{new Date(selectedPurchase.created_at).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Purchase Dialog */}
        <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog} maxWidth="md" fullWidth>
          <DialogTitle>{isEditing ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Item Name"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Purchase Date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="payment-method-label">Payment Method</InputLabel>
                  <Select
                    labelId="payment-method-label"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice Number"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddEditDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this purchase? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
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
      </Container>
    </>
  );
}