import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField, CircularProgress, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Admin.module.css';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Summary Card Component
const SummaryCard = ({ title, value, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom variant="overline">
        {title}
      </Typography>
      <Typography color="textPrimary" variant="h4" sx={{ color }}>
        ₹{value.toLocaleString()}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function ProfitLossPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    monthlyData: [],
    incomeByCategory: [],
    expensesByCategory: [],
  });

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && user.role !== 'employee') {
        router.push('/tenant/dashboard');
      } else {
        // Fetch financial data
        fetchFinancialData();
      }
    }
  }, [user, loading, router, period, year, month, startDate, endDate]);

  const fetchFinancialData = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call with filters
      // For now, we'll use mock data
      
      // Mock monthly data for the year
      const mockMonthlyData = [
        { month: 'Jan', income: 120000, expenses: 85000, profit: 35000 },
        { month: 'Feb', income: 135000, expenses: 90000, profit: 45000 },
        { month: 'Mar', income: 125000, expenses: 88000, profit: 37000 },
        { month: 'Apr', income: 140000, expenses: 95000, profit: 45000 },
        { month: 'May', income: 150000, expenses: 100000, profit: 50000 },
        { month: 'Jun', income: 145000, expenses: 98000, profit: 47000 },
        { month: 'Jul', income: 155000, expenses: 105000, profit: 50000 },
        { month: 'Aug', income: 160000, expenses: 110000, profit: 50000 },
        { month: 'Sep', income: 150000, expenses: 100000, profit: 50000 },
        { month: 'Oct', income: 165000, expenses: 115000, profit: 50000 },
        { month: 'Nov', income: 170000, expenses: 120000, profit: 50000 },
        { month: 'Dec', income: 180000, expenses: 125000, profit: 55000 }
      ];

      // Mock income by category
      const mockIncomeByCategory = [
        { name: 'Rent', value: 1200000 },
        { name: 'Amenities', value: 300000 },
        { name: 'Services', value: 150000 },
        { name: 'Deposits', value: 100000 },
        { name: 'Other', value: 50000 }
      ];

      // Mock expenses by category
      const mockExpensesByCategory = [
        { name: 'Maintenance', value: 400000 },
        { name: 'Utilities', value: 350000 },
        { name: 'Salaries', value: 500000 },
        { name: 'Taxes', value: 250000 },
        { name: 'Insurance', value: 150000 },
        { name: 'Supplies', value: 100000 },
        { name: 'Marketing', value: 80000 },
        { name: 'Other', value: 70000 }
      ];

      // Calculate totals
      const totalIncome = mockMonthlyData.reduce((sum, item) => sum + item.income, 0);
      const totalExpenses = mockMonthlyData.reduce((sum, item) => sum + item.expenses, 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = (netProfit / totalIncome) * 100;

      setFinancialData({
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        monthlyData: mockMonthlyData,
        incomeByCategory: mockIncomeByCategory,
        expensesByCategory: mockExpensesByCategory
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

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
        <title>Profit & Loss | Arkedia Homes</title>
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
              Profit & Loss Statement
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={() => alert('Export functionality will be implemented soon!')}
            >
              Export Report
            </Button>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters</Typography>
            </Box>
            <Grid container spacing={3}>
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
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<DateRangeIcon />}
                  sx={{ height: '56px' }}
                  fullWidth
                  onClick={fetchFinancialData}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard 
                title="TOTAL INCOME" 
                value={financialData.totalIncome} 
                color="#4caf50" 
                subtitle={`For ${period === 'yearly' ? year : period === 'monthly' ? `${new Date(0, month).toLocaleString('default', { month: 'long' })} ${year}` : 'Selected Period'}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard 
                title="TOTAL EXPENSES" 
                value={financialData.totalExpenses} 
                color="#f44336" 
                subtitle={`For ${period === 'yearly' ? year : period === 'monthly' ? `${new Date(0, month).toLocaleString('default', { month: 'long' })} ${year}` : 'Selected Period'}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard 
                title="NET PROFIT/LOSS" 
                value={financialData.netProfit} 
                color={financialData.netProfit >= 0 ? "#4caf50" : "#f44336"} 
                subtitle={`For ${period === 'yearly' ? year : period === 'monthly' ? `${new Date(0, month).toLocaleString('default', { month: 'long' })} ${year}` : 'Selected Period'}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard 
                title="PROFIT MARGIN" 
                value={financialData.profitMargin.toFixed(2) + '%'} 
                color={financialData.profitMargin >= 0 ? "#4caf50" : "#f44336"} 
                subtitle={`For ${period === 'yearly' ? year : period === 'monthly' ? `${new Date(0, month).toLocaleString('default', { month: 'long' })} ${year}` : 'Selected Period'}`}
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={4}>
            {/* Monthly Trend Chart */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Monthly Income vs Expenses</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={financialData.monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4caf50" name="Income" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#2196f3" name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Income by Category */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Income by Category</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financialData.incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {financialData.incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Expenses by Category */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={financialData.expensesByCategory}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                      <Bar dataKey="value" name="Amount">
                        {financialData.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Detailed Income Statement */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Detailed Income Statement</Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* Income Section */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Income</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {financialData.incomeByCategory.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body1">₹{item.value.toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Total Income</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="#4caf50">
                        ₹{financialData.totalIncome.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Expenses Section */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Expenses</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {financialData.expensesByCategory.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body1">₹{item.value.toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">Total Expenses</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="#f44336">
                        ₹{financialData.totalExpenses.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Net Profit/Loss */}
                <Divider sx={{ mb: 2 }} />
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Net Profit/Loss</Typography>
                    <Typography 
                      variant="h6" 
                      color={financialData.netProfit >= 0 ? "#4caf50" : "#f44336"}
                    >
                      ₹{financialData.netProfit.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}