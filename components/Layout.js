import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Divider, useMediaQuery, useTheme, ListItemIcon, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PoolIcon from '@mui/icons-material/Pool';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Added Dashboard Icon
import LayersIcon from '@mui/icons-material/Layers';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Group } from '@mui/icons-material';
import axios from 'axios'; // Import axios

// Helper function to get icon for category header
const getCategoryIcon = (category) => {
  const color = getIconColor(category);
  switch ((category || '').toLowerCase()) {
    case 'security': return <SecurityIcon sx={{ color }} />;
    case 'masters': return <LayersIcon sx={{ color }} />;
    case 'transactions': return <ReceiptLongIcon sx={{ color }} />;
    case 'accounts': return <AccountBalanceIcon sx={{ color }} />;
    case 'finance': return <SavingsIcon sx={{ color }} />;
    case 'other': return <MoreHorizIcon sx={{ color }} />;
    default: return <MoreHorizIcon sx={{ color }} />;
  }
};

// Helper function to get icon color based on category or page
const getIconColor = (categoryOrPage) => {
  switch ((categoryOrPage || '').toLowerCase()) {
    case 'security':
    case 'users':
    case 'change password':
      return '#1976d2'; // Blue
    case 'masters':
    case 'properties':
    case 'employees':
    case 'rooms':
    case 'tenants':
    case 'vendors':
    case 'amenities':
    case 'groceries':
    case 'services':
      return '#388e3c'; // Green
    case 'transactions':
    case 'expenses':
    case 'purchases':
    case 'purchase list':
      return '#f57c00'; // Orange
    case 'accounts':
    case 'payments':
    case 'profit & loss':
      return '#7b1fa2'; // Purple
    case 'finance':
      return '#00897b'; // Teal
    default:
      return '#757575'; // Grey
  }
};

// Helper function to get icon based on page name (customize as needed)
const getIconForPage = (pageName, category) => {
  const color = getIconColor(category || pageName);
  switch (pageName.toLowerCase()) {
    case 'dashboard': return <DashboardIcon sx={{ color }} />;
    case 'rooms': return <MeetingRoomIcon sx={{ color }} />;
    case 'tenants': return <PeopleIcon sx={{ color }} />;
    case 'employees': return <PersonIcon sx={{ color }} />;
    case 'amenities': return <PoolIcon sx={{ color }} />;
    case 'groceries': return <ShoppingBasketIcon sx={{ color }} />;
    case 'services': return <MiscellaneousServicesIcon sx={{ color }} />;
    case 'vendors': return <Group sx={{ color }} />;
    case 'purchase list': return <ShoppingCartIcon sx={{ color }} />;
    case 'purchases': return <AddShoppingCartIcon sx={{ color }} />;
    case 'expenses': return <PaymentsIcon sx={{ color }} />;
    case 'rent collection': return <MonetizationOnIcon sx={{ color }} />;
    case 'profit & loss': return <AssessmentIcon sx={{ color }} />;
    case 'user access control': return <AdminPanelSettingsIcon sx={{ color }} />;
    case 'change password': return <LockIcon sx={{ color }} />;
    default: return <SecurityIcon sx={{ color }} />; // Default icon
  }
};

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userForms, setUserForms] = useState([]); // State for user-specific forms
  const [openCategories, setOpenCategories] = useState({}); // State for collapsible categories
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryClick = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Fetch user forms when user is logged in and is admin or employee
  useEffect(() => {
    console.log('Layout useEffect triggered. User:', user); // Debug log for user
    const fetchUserForms = async () => {
      if (user && (user.role === 'admin' || user.role === 'employee')) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const token = localStorage.getItem('token');
          if (!API_URL || !token) {
            console.error('API URL or token not found');
            return;
          }
          const apiUrl = `${API_URL}/permissions/forms`;
          console.log('Fetching forms from:', apiUrl, 'for userId:', user.id); // Debug log for API call
          const response = await axios.get(`${API_URL}/permissions/forms`, {
            params: { userId: user.id },
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('API Response:', response.data); // Debug log for API response
          if (response.data.success) {
            const formsData = response.data.data || [];
            setUserForms(formsData);
            console.log('User forms set:', formsData); // Debug log for userForms state
            // Initialize open categories state based on fetched forms
            const initialOpenState = response.data.data.reduce((acc, form) => {
              if (form.page_category) {
                acc[form.page_category] = true; // Default to open
              }
              return acc;
            }, {});
            setOpenCategories(initialOpenState);
          } else {
            console.error('Failed to fetch user forms:', response.data.message);
            setUserForms([]);
          }
        } catch (error) {
          console.error('Error fetching user forms:', error);
          setUserForms([]);
        }
      }
    };

    fetchUserForms();
  }, [user]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          Arkedia Homes
        </Typography>
        <IconButton edge="end" color="inherit" aria-label="close drawer" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={Link} 
            href={item.path}
            selected={router.pathname === item.path}
            sx={{
              color: router.pathname === item.path ? 'primary.main' : 'inherit',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {user ? (
          <>
            <ListItem 
              component={Link} 
              href={user.role === 'admin' || user.role === 'employee' ? '/admin/dashboard' : '/tenant/dashboard'}
              selected={router.pathname.includes('/dashboard')}
              sx={{
                color: router.pathname.includes('/dashboard') ? 'primary.main' : 'inherit',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem 
              component={Link} 
              href="/signin"
              selected={router.pathname === '/signin'}
              sx={{
                color: router.pathname === '/signin' ? 'primary.main' : 'inherit',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/signup"
              selected={router.pathname === '/signup'}
              sx={{
                color: router.pathname === '/signup' ? 'primary.main' : 'inherit',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  // Explicit mapping of pages to categories for sidebar
  const sidebarCategoryMap = {
  Security: [
    { page_name: 'Users', page_url: '/admin/security/users' },
    { page_name: 'Change Password', page_url: '/admin/security/password' },
  ],
  Masters: [
    { page_name: 'Properties', page_url: '/admin/properties' },
    { page_name: 'Employees', page_url: '/admin/employees' },
    { page_name: 'Rooms', page_url: '/admin/rooms' },
    { page_name: 'Tenants', page_url: '/admin/tenants' },
    { page_name: 'Vendors', page_url: '/admin/vendors' },
    { page_name: 'Amenities', page_url: '/admin/amenities' },
    { page_name: 'Groceries', page_url: '/admin/groceries' },
    { page_name: 'Services', page_url: '/admin/services' },
    { page_name: 'Meal Tariff Master', page_url: '/admin/meal-tariff-master' },
  ],
  Transactions: [
    { page_name: 'Expenses', page_url: '/admin/expenses' },
    { page_name: 'Purchases', page_url: '/admin/purchases' },
    { page_name: 'Purchase List', page_url: '/admin/purchase-list' },
  ],
  Accounts: [
    { page_name: 'Payments', page_url: '/admin/payments' },
    { page_name: 'Profit & Loss', page_url: '/admin/profit-loss' },
  ],
  Finance: [],
  Other: []
};

  // Merge backend forms into explicit mapping if needed
  userForms.forEach(form => {
    let found = false;
    Object.keys(sidebarCategoryMap).forEach(category => {
      if (sidebarCategoryMap[category].some(item => item.page_url === form.page_url)) {
        found = true;
      }
    });
    // Exclude dashboard and change password from Others
    const isDashboard = form.page_name && form.page_name.toLowerCase().includes('dashboard');
    const isChangePassword = form.page_name && form.page_name.toLowerCase().includes('change password');
    const isChangePasswordUrl = form.page_url === '/admin/security/change-password';
    if (!found && !isDashboard && !isChangePassword && !isChangePasswordUrl) {
      sidebarCategoryMap.Other.push(form);
    }
  });

  const categoryOrder = ['Security', 'Masters', 'Transactions', 'Accounts', 'Finance', 'Other'];

  const adminSidebarContent = (
    <Box sx={{ overflow: 'auto', height: 'calc(100vh - 64px)' }}> {/* Adjust height based on AppBar */} 
      <List>
        {/* Always include Dashboard */} 
        <ListItem 
          component={Link} 
          href="/admin/dashboard"
          selected={router.pathname === '/admin/dashboard'}
          sx={{ pl: sidebarCollapsed ? 2 : 4 }} // Adjust padding when collapsed
        >
          <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40, mr: sidebarCollapsed ? 1 : 1 }}>
            <DashboardIcon />
          </ListItemIcon>
          {!sidebarCollapsed && <ListItemText primary="Dashboard" />}
        </ListItem>

        {categoryOrder.map((category) => (
  <React.Fragment key={category}>
    <ListItemButton onClick={() => handleCategoryClick(category)} sx={{ pl: sidebarCollapsed ? 2 : 4 }}>
      <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40, mr: sidebarCollapsed ? 1 : 1 }}>
        {getCategoryIcon(category)}
      </ListItemIcon>
      {!sidebarCollapsed && <ListItemText primary={category} />}
      {!sidebarCollapsed && (openCategories[category] ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
    <Collapse in={!sidebarCollapsed && openCategories[category]} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {sidebarCategoryMap[category].map((item) => (
  <ListItem
    button
    key={item.page_name}
    component={router.pathname === item.page_url ? 'div' : Link}
    href={router.pathname === item.page_url ? undefined : item.page_url}
    selected={router.pathname === item.page_url}
    sx={{ pl: sidebarCollapsed ? 3 : 6, cursor: router.pathname === item.page_url ? 'default' : 'pointer' }}
    onClick={e => {
      if (router.pathname === item.page_url) {
        e.preventDefault();
        return;
      }
    }}
  >
    <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40, mr: sidebarCollapsed ? 1 : 1 }}>
      {getIconForPage(item.page_name, category)}
    </ListItemIcon>
    {!sidebarCollapsed && <ListItemText primary={item.page_name} />}
  </ListItem>
))}
      </List>
    </Collapse>
  </React.Fragment>
))}
      </List>
    </Box>
  );

  const tenantSidebarContent = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="/assets/logo.png"
                alt="Arkedia Homes Logo"
                sx={{ height: 40, mr: 1 }}
              />
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                Arkedia Homes
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.path}
                    sx={{
                      mx: 1,
                      color: router.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: router.pathname === item.path ? 600 : 400,
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                {user ? (
                  <>
                    <Button
                      component={Link}
                      href={user.role === 'admin' || user.role === 'employee' ? '/admin/dashboard' : '/tenant/dashboard'}
                      color={router.pathname.includes('/dashboard') ? 'primary' : 'inherit'}
                    >
                      Dashboard
                    </Button>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button component={Link} href="/signin" color={router.pathname === '/signin' ? 'primary' : 'inherit'}>Sign In</Button>
                    <Button component={Link} href="/signup" color={router.pathname === '/signup' ? 'primary' : 'inherit'}>Sign Up</Button>
                  </>
                )}
              </Box>
            )}

            {/* Mobile Navigation Toggle */} 
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */} 
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar for Admin/Employee/Tenant */} 
        {user && (user.role === 'admin' || user.role === 'employee' || user.role === 'tenant') && !isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: sidebarCollapsed ? theme.spacing(9) : 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: sidebarCollapsed ? theme.spacing(9) : 240,
                boxSizing: 'border-box',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                overflowX: 'hidden',
                position: 'sticky', // Make sidebar sticky
                top: 64, // Adjust based on AppBar height
                height: 'calc(100vh - 64px)', // Adjust height
              },
            }}
          >
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
              <IconButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Toolbar>
            <Divider />
            {(user.role === 'admin' || user.role === 'employee') && adminSidebarContent}
            {user.role === 'tenant' && tenantSidebarContent}
          </Drawer>
        )}

        {/* Main Content */} 
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${user && (user.role === 'admin' || user.role === 'employee' || user.role === 'tenant') && !isMobile ? (sidebarCollapsed ? theme.spacing(9) : 240) : 0}px)` },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {/* Add top margin to prevent content from hiding behind AppBar */} 
          {/* <Toolbar />  Removed this Toolbar as AppBar is sticky */} 
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;