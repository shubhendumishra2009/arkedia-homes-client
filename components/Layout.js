import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Divider, useMediaQuery, useTheme, ListItemIcon } from '@mui/material';
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
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
              href={user.role === 'admin' ? '/admin/dashboard' : '/tenant/dashboard'}
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

  const adminSidebarItems = [
  {
        title: 'Security',
        icon: <SecurityIcon sx={{ color: '#2196f3' }} />, // Blue color for Security section
        items: [
          { name: 'User Access Control', path: '/admin/security/users', icon: <AdminPanelSettingsIcon /> },
          { name: 'Change Password', path: '/admin/security/password', icon: <LockIcon /> },
        ],
        color: '#2196f3' // Blue
  },
  {
    title: 'Masters',
    icon: <PeopleIcon sx={{ color: '#4caf50' }} />, // Green color for Masters section
    items: [
      { name: 'Rooms', path: '/admin/rooms', icon: <MeetingRoomIcon/> },
      { name: 'Tenants', path: '/admin/tenants', icon: <PeopleIcon /> },
      { name: 'Employees', path: '/admin/employees', icon: <PersonIcon /> },
      { name: 'Amenities', path: '/admin/amenities', icon: <PoolIcon /> },
      { name: 'Groceries', path: '/admin/groceries', icon: <ShoppingBasketIcon /> },
      { name: 'Services', path: '/admin/services', icon: <MiscellaneousServicesIcon /> },
    ],
    color: '#4caf50' // Green
  },
 
  {
    title: 'Finance',
    icon: <PaymentsIcon sx={{ color: '#ff9800' }} />, // Orange color for Finance section
    items: [
      { name: 'Purchase List', path: '/admin/purchase-list', icon: <ShoppingCartIcon /> },
      { name: 'Purchases', path: '/admin/purchases', icon: <AddShoppingCartIcon /> },
      { name: 'Expenses', path: '/admin/expenses', icon: <PaymentsIcon /> },
      { name: 'Rent Collection', path: '/admin/payments', icon: <MonetizationOnIcon /> },
      { name: 'Profit & Loss', path: '/admin/profit-loss', icon: <AssessmentIcon /> },
    ],
    color: '#ff9800' // Orange
  },
 
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
                      href={user.role === 'admin' ? '/admin/dashboard' : '/tenant/dashboard'}
                      sx={{
                        mx: 1,
                        color: router.pathname.includes('/dashboard') ? 'primary.main' : 'text.primary',
                        fontWeight: router.pathname.includes('/dashboard') ? 600 : 400,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.main',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={logout}
                      sx={{ ml: 2 }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/signin"
                      sx={{
                        mx: 1,
                        color: router.pathname === '/signin' ? 'primary.main' : 'text.primary',
                        fontWeight: router.pathname === '/signin' ? 600 : 400,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.main',
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      href="/signup"
                      sx={{ ml: 1 }}
                    >
                      Sign Up
                    </Button>
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

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px - 64px)' }}>
        {router.pathname.includes('/admin') && (
          <Drawer
            variant="permanent"
            sx={{
              width: sidebarCollapsed ? 64 : 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: sidebarCollapsed ? 64 : 240,
                boxSizing: 'border-box',
                height: 'calc(100vh - 64px - 64px)', // Subtract header and footer heights
                mt: '64px', // Match header height
                position: 'fixed',
                overflow: 'auto',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Toolbar>
            <Divider />
            <List sx={{ overflowX: 'hidden' }}>
              {adminSidebarItems.map((section) => (
                <Box key={section.title}>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 0 : 36 }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={section.title} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      sx={{ display: sidebarCollapsed ? 'none' : 'block' }}
                    />
                  </ListItem>
                  {section.items.map((item) => (
                    <ListItemButton 
                      key={item.name} 
                      component={Link}
                      href={item.path}
                      selected={router.pathname === item.path}
                      sx={{ 
                        pl: sidebarCollapsed ? 2 : 4,
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: sidebarCollapsed ? 0 : 36,
                        color: router.pathname === item.path ? section.color : 'text.secondary'
                      }}>
                        {React.cloneElement(item.icon, { 
                          sx: { color: router.pathname === item.path ? section.color : 'inherit' } 
                        })}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.name} 
                        sx={{ display: sidebarCollapsed ? 'none' : 'block' }}
                      />
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </List>
          </Drawer>
        )}
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>

      {/* Footer */}
      {!user || user.role !== 'admin' ? <Footer /> : null}
    </Box>
  );
};

export default Layout;