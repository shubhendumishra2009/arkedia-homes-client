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

export default function ExpensesManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    payment_method: '',
    reference_number: '',
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
        // Fetch expenses data
        fetchExpenses();
      }
    }
  }, [user, loading, router]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, we'll use mock data
      const mockExpenses = [
        {
          id: 1,
          description: 'Electricity Bill',
          amount: 12500,
          date: '2023-10-05T00:00:00',
          category: 'utilities',
          payment_method: 'bank_transfer',
          reference_number: 'ref_123456',
          notes: 'Monthly electricity bill for the building',
          created_at: '2023-10-05T10:30:00'
        },
        {
          id: 2,
          description: 'Water Supply',
          amount: 8000,
          date: '2023-10-07T00:00:00',
          category: 'utilities',
          payment_method: 'credit_card',
          reference_number: 'cc_789012',
          notes: 'Monthly water bill',
          created_at: '2023-10-07T14:15:00'
        },
        {
          id: 3,
          description: 'Building Maintenance',
          amount: 15000,
          date: '2023-10-10T00:00:00',
          category: 'maintenance',
          payment_method: 'cash',
          reference_number: 'cash_receipt_345',
          notes: 'Repair of common area facilities',
          created_at: '2023-10-10T09:45:00'
        },
        {
          id: 4,
          description: 'Security Staff Salary',
          amount: 35000,
          date: '2023-10-01T00:00:00',
          category: 'salaries',
          payment_method: 'bank_transfer',
          reference_number: 'sal_oct_sec_01',
          notes: 'October salary for security personnel',
          created_at: '2023-10-01T11:20:00'
        },
        {
          id: 5,
          description: 'Cleaning Supplies',
          amount: 5000,
          date: '2023-10-12T00:00:00',
          category: 'supplies',
          payment_method: 'credit_card',
          reference_number: 'cc_567890',
          notes: 'Monthly cleaning supplies purchase',
          created_at: '2023-10-12T16:30:00'
        },
        {
          id: 6,
          description: 'Internet Service',
          amount: 7500,
          date: '2023-10-08T00:00:00',
          category: 'utilities',
          payment_method: 'bank_transfer',
          reference_number: 'net_oct_2023',
          notes: 'Monthly internet service fee',
          created_at: '2023-10-08T13:10:00'
        },
        {
          id: 7,
          description: 'Gardening Service',
          amount: 6000,
          date: '2023-10-15T00:00:00',
          category: 'maintenance',
          payment_method: 'cash',
          reference_number: 'cash_receipt_678',
          notes: 'Monthly gardening service',
          created_at: '2023-10-15T10:00:00'
        },
        {
          id: 8,
          description: 'Property Tax',
          amount: 45000,
          date: '2023-09-30T00:00:00',
          category: 'taxes',
          payment_method: 'bank_transfer',
          reference_number: 'tax_q3_2023',
          notes: 'Quarterly property tax payment',
          created_at: '2023-09-30T09:30:00'
        }
      ];
      
      setExpenses(mockExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch expenses',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenViewDialog = (expense) => {
    setSelectedExpense(expense);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedExpense(null);
  };

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setFormData({
      description: '',
      amount: '',
      date: '',
      category: '',
      payment_method: '',
      reference_number: '',
      notes: ''
    });
    setOpenAddEditDialog(true);
  };

  const handleOpenEditDialog = (expense) => {
    setIsEditing(true);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date.split('T')[0], // Format date for input field
      category: expense.category,
      payment_method: expense.payment_method,
      reference_number: expense.reference_number,
      notes: expense.notes
    });
    setSelectedExpense(expense);
    setOpenAddEditDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
    setSelectedExpense(null);
  };

  const handleOpenDeleteDialog = (expense) => {
    setSelectedExpense(expense);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedExpense(null);
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
    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    // In a real application, this would be an API call to save the data
    if (isEditing) {
      // Update existing expense
      const updatedExpenses = expenses.map(expense => {
        if (expense.id === selectedExpense.id) {
          return {
            ...expense,
            ...formData,
            amount: Number(formData.amount)
          };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
      setSnackbar({
        open: true,
        message: 'Expense updated successfully',
        severity: 'success'
      });
    } else {
      // Add new expense
      const newExpense = {
        id: Math.max(...expenses.map(e => e.id)) + 1,
        ...formData,
        amount: Number(formData.amount),
        created_at: new Date().toISOString()
      };
      setExpenses([newExpense, ...expenses]);
      setSnackbar({
        open: true,
        message: 'Expense added successfully',
        severity: 'success'
      });
    }

    handleCloseAddEditDialog();
  };

  const handleDelete = () => {
    // In a real application, this would be an API call to delete the data
    const updatedExpenses = expenses.filter(expense => expense.id !== selectedExpense.id);
    setExpenses(updatedExpenses);
    setSnackbar({
      open: true,
      message: 'Expense deleted successfully',
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'month') {
      setFilterMonth(value);
    } else if (name === 'category') {
      setFilterCategory(value);
    }
  };

  const resetFilters = () => {
    setFilterMonth('');
    setFilterCategory('');
  };

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      // Filter by month if selected
      const monthMatch = !filterMonth || new Date(expense.date).toLocaleString('default', { month: 'long' }) === filterMonth;
      
      // Filter by category if selected
      const categoryMatch = !filterCategory || expense.category === filterCategory;
      
      return monthMatch && categoryMatch;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatCategory = (category) => {
    if (!category) return 'N/A';
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPaymentMethod = (method) => {
    if (!method) return 'N/A';
    return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'utilities':
        return 'primary';
      case 'maintenance':
        return 'secondary';
      case 'salaries':
        return 'info';
      case 'taxes':
        return 'error';
      case 'supplies':
        return 'warning';
      case 'insurance':
        return 'success';
      default:
        return 'default';
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(expenses.map(expense => expense.category))];
    return categories;
  };

  const getUniqueMonths = () => {
    const months = [...new Set(expenses.map(expense => {
      return new Date(expense.date).toLocaleString('default', { month: 'long' });
    }))];
    return months;
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
        <title>Expenses Management | Arkedia Homes</title>
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
              Expenses Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
            >
              Add New Expense
            </Button>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    name="month"
                    value={filterMonth}
                    label="Month"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Months</MenuItem>
                    {getUniqueMonths().map((month) => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={filterCategory}
                    label="Category"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {getUniqueCategories().map((category) => (
                      <MenuItem key={category} value={category}>{formatCategory(category)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  sx={{ height: '56px' }}
                  fullWidth
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredExpenses().map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatCategory(expense.category)}
                        color={getCategoryColor(expense.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatAmount(expense.amount)}</TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{formatPaymentMethod(expense.payment_method)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenViewDialog(expense)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenEditDialog(expense)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(expense)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {getFilteredExpenses().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No expenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* View Expense Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md">
        <DialogTitle>Expense Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedExpense?.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Chip
                  label={formatCategory(selectedExpense?.category)}
                  color={getCategoryColor(selectedExpense?.category)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Amount
                </Typography>
                <Typography variant="body1">
                  {selectedExpense ? formatAmount(selectedExpense.amount) : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedExpense?.date)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {formatPaymentMethod(selectedExpense?.payment_method)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Reference Number
                </Typography>
                <Typography variant="body1">
                  {selectedExpense?.reference_number || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">
                  {selectedExpense?.notes || 'No notes'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {selectedExpense ? new Date(selectedExpense.created_at).toLocaleString() : ''}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ReceiptIcon />}
            onClick={() => alert('Receipt download functionality will be implemented soon!')}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog} maxWidth="md">
        <DialogTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="utilities">Utilities</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="salaries">Salaries</MenuItem>
                    <MenuItem value="taxes">Taxes</MenuItem>
                    <MenuItem value="supplies">Supplies</MenuItem>
                    <MenuItem value="insurance">Insurance</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    label="Payment Method"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEditDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the expense "{selectedExpense?.description}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDelete}
          >
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
    </>
  );
}