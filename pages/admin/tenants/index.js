import React, { useEffect, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, Chip
} from '@mui/material';
import styles from '@/styles/Admin.module.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Add, Edit, Delete } from '@mui/icons-material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const initialTenantForm = {
  name: '',
  email: '',
  phone: '',
  payment_due_day: 1,
  status: 'active',
  notes: '',
};

const initialLeaseForm = {
  room_id: '',
  property_id: '',
  lease_start_date: '',
  lease_end_date: '',
  rent_amount: '',
  security_deposit: '',
  payment_due_day: 1,
  status: 'active',
  notes: '',
};

function TenantsManagement() {
  // ...existing state
  const [editLeaseDialog, setEditLeaseDialog] = useState(false);
  const [editLeaseForm, setEditLeaseForm] = useState(initialLeaseForm);
  const [editLeaseId, setEditLeaseId] = useState(null);
  const [editLeaseTenant, setEditLeaseTenant] = useState(null);

  // Handler to open edit lease dialog
  const handleEditLease = (tenant, lease) => {
    setEditLeaseForm({ ...lease, property_id: lease.property_id || lease.property?.id, room_id: lease.room_id || lease.room?.id });
    setEditLeaseId(lease.id);
    setEditLeaseTenant(tenant);
    setEditLeaseDialog(true);
  };

  // Handler to close edit lease dialog
  const handleCloseEditLeaseDialog = () => {
    setEditLeaseDialog(false);
    setEditLeaseForm(initialLeaseForm);
    setEditLeaseId(null);
    setEditLeaseTenant(null);
  };

  // Handler to submit edit lease
  const handleEditLeaseSubmit = async () => {
    try {
      await axios.put(`${API_URL}/tenant-leases/${editLeaseId}`,
        {
          lease_start_date: editLeaseForm.lease_start_date,
          lease_end_date: editLeaseForm.lease_end_date,
          rent_amount: editLeaseForm.rent_amount,
          security_deposit: editLeaseForm.security_deposit,
          payment_due_day: editLeaseForm.payment_due_day,
          status: editLeaseForm.status,
          notes: editLeaseForm.notes,
        }
      );
      setSnackbar({ open: true, message: 'Lease updated', severity: 'success' });
      fetchTenants();
      handleCloseEditLeaseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || 'Failed to update lease', severity: 'error' });
    }
  };

  // Handler to delete lease
  const handleDeleteLease = async (tenant, lease) => {
    if (!window.confirm('Are you sure you want to delete this lease? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/tenant-leases/${lease.id}`);
      setSnackbar({ open: true, message: 'Lease deleted', severity: 'success' });
      fetchTenants();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || 'Failed to delete lease', severity: 'error' });
    }
  };

  const [openTenantRowIdx, setOpenTenantRowIdx] = useState(null);
  const handleToggleTenantRow = (idx) => {
    setOpenTenantRowIdx(prevIdx => (prevIdx === idx ? null : idx));
  };

  const [tenants, setTenants] = useState([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantStatusFilter, setTenantStatusFilter] = useState('all');
  const [openTenantDialog, setOpenTenantDialog] = useState(false);
  const [openLeaseDialog, setOpenLeaseDialog] = useState(false);
  const [tenantForm, setTenantForm] = useState(initialTenantForm);
  const [leaseForm, setLeaseForm] = useState(initialLeaseForm);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [leasesToAssign, setLeasesToAssign] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Helper to get rent amount based on selected room and lease period
  function calculateRentAmount(form, roomsList) {
    const { room_id, lease_start_date, lease_end_date } = form;
    if (!room_id || !lease_start_date || !lease_end_date) return '';
    const room = roomsList.find(r => r.id === room_id);
    if (!room) return '';
    // Use pricing logic from backend: shortTerm, mediumTerm, longTerm
    const start = new Date(lease_start_date);
    const end = new Date(lease_end_date);
    if (isNaN(start) || isNaN(end) || end <= start) return '';
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    let price = '';
    if (diffDays < 30) {
      price = (room.short_term_price !== undefined && room.short_term_price !== null)
        ? room.short_term_price
        : (room.pricing?.shortTerm || (room.base_rent ? room.base_rent * 1.2 : ''));
    } else if (diffMonths < 5) {
      price = (room.medium_term_price !== undefined && room.medium_term_price !== null)
        ? room.medium_term_price
        : (room.pricing?.mediumTerm || (room.base_rent ? room.base_rent * 1.1 : ''));
    } else {
      price = (room.long_term_price !== undefined && room.long_term_price !== null)
        ? room.long_term_price
        : (room.pricing?.longTerm || room.base_rent);
    }
    return Number(price).toFixed(2);
  }

  function rentHelperText(form, roomsList) {
    const { lease_start_date, lease_end_date } = form;
    if (!lease_start_date || !lease_end_date) return 'Select lease dates to see rent.';
    const start = new Date(lease_start_date);
    const end = new Date(lease_end_date);
    if (isNaN(start) || isNaN(end) || end <= start) return 'Invalid lease period.';
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return 'Short Term Pricing (below 1 month)';
    if (diffMonths < 5) return 'Medium Term Pricing (1-5 months)';
    return 'Long Term Pricing (5+ months)';
  }

  // Fetch rooms for a specific property
  const fetchRoomsByProperty = async (propertyId) => {
    if (!propertyId) {
      setRooms([]);
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/rooms/property/${propertyId}`);
      setRooms(data.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch rooms', severity: 'error' });
      setRooms([]);
    }
  };
  const [loading, setLoading] = useState(false);

  // Fetch tenants
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/tenants`);
      setTenants(data.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch tenants', severity: 'error' });
    }
    setLoading(false);
  };

  // Fetch properties and rooms
  const fetchPropertiesAndRooms = async () => {
    try {
      const { data: propData } = await axios.get(`${API_URL}/properties`);
      setProperties(propData.data || []);
      // For demo: fetch all rooms
      const { data: roomData } = await axios.get(`${API_URL}/rooms`);
      setRooms(roomData.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch properties/rooms', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchPropertiesAndRooms();
  }, []);

  // Tenant dialog handlers
  const handleOpenTenantDialog = (tenant = null) => {
    setSelectedTenant(tenant);
    setTenantForm(tenant ? {
      name: tenant.user?.name || '',
      email: tenant.user?.email || '',
      phone: tenant.user?.phone || '',
      payment_due_day: tenant.payment_due_day,
      status: tenant.status,
      notes: tenant.notes || '',
    } : initialTenantForm);
    setOpenTenantDialog(true);
  };
  const handleCloseTenantDialog = () => {
    setOpenTenantDialog(false);
    setTenantForm(initialTenantForm);
    setSelectedTenant(null);
  };

  // Lease dialog handlers
  const handleOpenLeaseDialog = (tenant) => {
    setSelectedTenant(tenant);
    setLeaseForm(initialLeaseForm);
    setLeasesToAssign([]);
    setOpenLeaseDialog(true);
  };
  const handleCloseLeaseDialog = () => {
    setOpenLeaseDialog(false);
    setLeaseForm(initialLeaseForm);
    setLeasesToAssign([]);
    setSelectedTenant(null);
  };

  // Tenant form submit
  const handleTenantSubmit = async () => {
    try {
      if (selectedTenant) {
        // Update tenant
        await axios.put(`${API_URL}/tenants/${selectedTenant.id}`, tenantForm);
        setSnackbar({ open: true, message: 'Tenant updated', severity: 'success' });
      } else {
        // Create tenant
        await axios.post(`${API_URL}/tenants`, tenantForm);
        setSnackbar({ open: true, message: 'Tenant created', severity: 'success' });
      }
      fetchTenants();
      handleCloseTenantDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save tenant', severity: 'error' });
    }
  };

  // Assign leases submit
  const handleLeaseSubmit = async () => {
    try {
      await axios.post(`${API_URL}/tenants/assign-leases`, {
        tenant_id: selectedTenant.id,
        leases: leasesToAssign,
      });
      setSnackbar({ open: true, message: 'Leases assigned', severity: 'success' });
      fetchTenants();
      handleCloseLeaseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to assign leases', severity: 'error' });
    }
  };

  // Delete tenant
  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;
    try {
      await axios.delete(`${API_URL}/tenants/${tenantId}`);
      setSnackbar({ open: true, message: 'Tenant deleted', severity: 'success' });
      fetchTenants();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete tenant', severity: 'error' });
    }
  };

  // Lease form add
  const handleAddLease = () => {
    if (!leaseForm.lease_start_date || !leaseForm.lease_end_date) {
      setSnackbar({ open: true, message: 'Lease start and end dates are required.', severity: 'warning' });
      return;
    }
    if (!leaseForm.rent_amount || isNaN(Number(leaseForm.rent_amount))) {
      setSnackbar({ open: true, message: 'Rent amount is required and must be a number.', severity: 'warning' });
      return;
    }
    setLeasesToAssign([...leasesToAssign, leaseForm]);
    setLeaseForm(initialLeaseForm);
  };
  const handleRemoveLease = (idx) => {
    setLeasesToAssign(leasesToAssign.filter((_, i) => i !== idx));
  };

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Tenant Management</Typography>
        <Tooltip title="Add Tenant" arrow>
          <Button
            className={styles.primaryButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTenantDialog()}
          >
            Add Tenant
          </Button>
        </Tooltip>
      </Box>
      {/* Tenant Search and Status Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search tenants..."
          variant="outlined"
          value={tenantSearch}
          onChange={e => setTenantSearch(e.target.value)}
          size="small"
          sx={{ width: 320 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={tenantStatusFilter}
            onChange={e => setTenantStatusFilter(e.target.value)}
            MenuProps={{ PaperProps: { sx: { width: 150 } } }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants
  .filter(tenant => {
    // Status filter
    if (tenantStatusFilter !== 'all' && tenant.status !== tenantStatusFilter) return false;
    const q = tenantSearch.toLowerCase();
    return (
      tenant.user?.name?.toLowerCase().includes(q) ||
      tenant.user?.email?.toLowerCase().includes(q) ||
      tenant.user?.phone?.toLowerCase().includes(q)
    );
  })
  .map((tenant, idx) => (
    <React.Fragment key={tenant.id}>
                <TableRow
                  sx={{ backgroundColor: idx % 2 === 0 ? '#90caf9' : '#1976d2', color: idx % 2 === 0 ? 'inherit' : '#fff', '& td, & th': { color: idx % 2 === 0 ? 'inherit' : '#fff' } }}
                >
                  <TableCell>
                    <IconButton
                      aria-label={openTenantRowIdx === idx ? 'Collapse' : 'Expand'}
                      size="small"
                      onClick={() => handleToggleTenantRow(idx)}
                      sx={{ mr: 1 }}
                    >
                      {openTenantRowIdx === idx ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    {tenant.user?.name}
                  </TableCell>
                  <TableCell>{tenant.user?.email}</TableCell>
                  <TableCell>{tenant.user?.phone}</TableCell>
                  <TableCell>{tenant.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Tenant" arrow>
                      <IconButton
                        className={styles.secondaryButton}
                        onClick={() => handleOpenTenantDialog(tenant)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Tenant" arrow>
                      <IconButton
                        className={styles.accentButton}
                        onClick={() => handleDeleteTenant(tenant.id)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Assign Lease" arrow>
                      <IconButton
                        className={styles.primaryButton}
                        onClick={() => handleOpenLeaseDialog(tenant)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={openTenantRowIdx === idx} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="subtitle1" gutterBottom>
                          Assigned Rooms
                        </Typography>
                        {tenant.leases && tenant.leases.length > 0 ? (
                          <Table size="small" sx={{ background: '#f8f8f8', borderRadius: 2 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Room Number</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Property</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Lease Start</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Lease End</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Rent</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tenant.leases.map((lease) => (
                                <TableRow key={lease.id}>
                                  <TableCell>{lease.room?.room_no || lease.room_no || lease.room_id}</TableCell>
                                  <TableCell>{lease.property?.name || lease.property_id}</TableCell>
                                  <TableCell>{lease.lease_start_date?.slice(0,10)}</TableCell>
                                  <TableCell>{lease.lease_end_date?.slice(0,10)}</TableCell>
                                  <TableCell>{lease.rent_amount}</TableCell>
                                  <TableCell>{lease.status}</TableCell>
                                  <TableCell>
                                    <Tooltip title="Edit Lease" arrow>
                                      <IconButton
                                        className={styles.secondaryButton}
                                        onClick={() => handleEditLease(tenant, lease)}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        disabled={lease.status !== 'active' || (lease.lease_end_date && new Date(lease.lease_end_date) < new Date())}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Lease" arrow>
                                      <IconButton
                                        className={styles.accentButton}
                                        onClick={() => handleDeleteLease(tenant, lease)}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        disabled={lease.status !== 'active' || (lease.lease_end_date && new Date(lease.lease_end_date) < new Date())}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography variant="body2" color="text.secondary">No assigned rooms.</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tenant Dialog */}
      <Dialog open={openTenantDialog} onClose={handleCloseTenantDialog}>
        <DialogTitle>{selectedTenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 320, sm: 600 }, maxWidth: 700 }}>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
      p: 2
    }}
  >
    <TextField label="Name" value={tenantForm.name} onChange={e => setTenantForm({ ...tenantForm, name: e.target.value })} fullWidth required />
    <TextField label="Email" value={tenantForm.email} onChange={e => setTenantForm({ ...tenantForm, email: e.target.value })} fullWidth required />
    <TextField label="Phone" value={tenantForm.phone} onChange={e => setTenantForm({ ...tenantForm, phone: e.target.value })} fullWidth />
    <TextField label="Payment Due Day" type="number" value={tenantForm.payment_due_day} onChange={e => setTenantForm({ ...tenantForm, payment_due_day: e.target.value })} fullWidth />
    <FormControl sx={{ width: '100%' }}>
      <InputLabel>Status</InputLabel>
      <Select value={tenantForm.status} label="Status" onChange={e => setTenantForm({ ...tenantForm, status: e.target.value })}>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
      </Select>
    </FormControl>
    <TextField label="Notes" value={tenantForm.notes} onChange={e => setTenantForm({ ...tenantForm, notes: e.target.value })} fullWidth multiline minRows={2} sx={{ gridColumn: '1 / span 2' }} />
  </Box>
</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTenantDialog}>Cancel</Button>
          <Button onClick={handleTenantSubmit} variant="contained">{selectedTenant ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Lease Assignment Dialog */}
      <Dialog open={openLeaseDialog} onClose={handleCloseLeaseDialog}>
        <DialogTitle>Assign Lease(s) to Tenant</DialogTitle>
<DialogContent sx={{ minWidth: { xs: 320, sm: 600 }, maxWidth: 700 }}>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
      p: 2
    }}
  >
    <FormControl sx={{ width: '100%' }}>
      <InputLabel>Property</InputLabel>
      <Select
        value={leaseForm.property_id}
        label="Property"
        onChange={e => {
          setLeaseForm({ ...leaseForm, property_id: e.target.value, room_id: '' });
          fetchRoomsByProperty(e.target.value);
        }}
        MenuProps={{ PaperProps: { sx: { width: 220 } } }}
      >
        {properties.map(prop => (
          <MenuItem key={prop.id} value={prop.id}>{prop.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl sx={{ width: '100%' }}>
      <InputLabel>Room</InputLabel>
      <Select value={leaseForm.room_id} label="Room" onChange={e => setLeaseForm({ ...leaseForm, room_id: e.target.value })} MenuProps={{ PaperProps: { sx: { width: 220 } } }}>
        {rooms.filter(r =>
  r.status === 'available' &&
  r.property_id === leaseForm.property_id &&
  !leasesToAssign.some(lease => lease.room_id === r.id)
).map(room => (
  <MenuItem key={room.id} value={room.id}>{room.room_no}</MenuItem>
))}
      </Select>
    </FormControl>
    <TextField
      label="Lease Start Date"
      type="date"
      value={leaseForm.lease_start_date}
      onChange={e => {
        const newStart = e.target.value;
        setLeaseForm(prev => {
          const updated = { ...prev, lease_start_date: newStart };
          return { ...updated, rent_amount: calculateRentAmount(updated, rooms) };
        });
      }}
      InputLabelProps={{ shrink: true }}
      fullWidth
      required
    />
    <TextField
      label="Lease End Date"
      type="date"
      value={leaseForm.lease_end_date}
      onChange={e => {
        const newEnd = e.target.value;
        setLeaseForm(prev => {
          const updated = { ...prev, lease_end_date: newEnd };
          return { ...updated, rent_amount: calculateRentAmount(updated, rooms) };
        });
      }}
      InputLabelProps={{ shrink: true }}
      fullWidth
      required
    />
    <TextField
      label="Rent Amount"
      type="number"
      value={leaseForm.rent_amount}
      InputProps={{ readOnly: true }}
      fullWidth
      required
      helperText={rentHelperText(leaseForm, rooms)}
    />
    <TextField
      label="Security Deposit"
      type="number"
      value={leaseForm.security_deposit}
      onChange={e => setLeaseForm({ ...leaseForm, security_deposit: e.target.value })}
      fullWidth
    />
    <TextField
      label="Payment Due Day"
      type="number"
      value={leaseForm.payment_due_day}
      onChange={e => setLeaseForm({ ...leaseForm, payment_due_day: e.target.value })}
      fullWidth
    />
    <Button onClick={handleAddLease} variant="outlined" sx={{ mt: 1, gridColumn: '1 / span 2' }}>
      Add Lease to List
    </Button>
    <Box sx={{ gridColumn: '1 / span 2' }}>
      {leasesToAssign.map((lease, idx) => (
        <Chip
          key={idx}
          label={`Room: ${rooms.find(r => r.id === lease.room_id)?.room_no || lease.room_id}, ${properties.find(p => p.id === lease.property_id)?.name || lease.property_id}, ${lease.lease_start_date} to ${lease.lease_end_date}`}
          onDelete={() => handleRemoveLease(idx)}
          sx={{ mr: 0.5, mb: 0.5 }}
        />
      ))}
    </Box>
  </Box>
</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaseDialog}>Cancel</Button>
          <Button onClick={handleLeaseSubmit} variant="contained" disabled={leasesToAssign.length === 0}>Assign Lease(s)</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lease Dialog */}
      <Dialog
  open={editLeaseDialog}
  onClose={handleCloseEditLeaseDialog}
  PaperProps={{
    sx: {
      minWidth: { xs: 320, sm: 600 },
      maxWidth: 700,
      minHeight: 400,
      maxHeight: 700,
      mt: 6
    }
  }}
>
        <DialogTitle sx={{ mb: 2 }}>Edit Lease</DialogTitle>
<DialogContent sx={{ minWidth: { xs: 320, sm: 600 }, maxWidth: 700, mt: 2 }}>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
      p: 2
    }}
  >
    <TextField
      label="Lease Start Date"
      type="date"
      value={editLeaseForm.lease_start_date}
      onChange={e => setEditLeaseForm({ ...editLeaseForm, lease_start_date: e.target.value })}
      InputLabelProps={{ shrink: true, style: { fontSize: 14, top: 0 } }}
      inputProps={{ style: { minHeight: 40 } }}
      fullWidth
      required
    />
    <TextField
      label="Lease End Date"
      type="date"
      value={editLeaseForm.lease_end_date}
      onChange={e => setEditLeaseForm({ ...editLeaseForm, lease_end_date: e.target.value })}
      InputLabelProps={{ shrink: true, style: { fontSize: 14, top: 0 } }}
      inputProps={{ style: { minHeight: 40 } }}
      fullWidth
      required
    />
    <TextField
      label="Rent Amount"
      type="number"
      value={editLeaseForm.rent_amount}
      onChange={e => setEditLeaseForm({ ...editLeaseForm, rent_amount: e.target.value })}
      fullWidth
      required
    />
    <TextField
      label="Security Deposit"
      type="number"
      value={editLeaseForm.security_deposit}
      onChange={e => setEditLeaseForm({ ...editLeaseForm, security_deposit: e.target.value })}
      fullWidth
    />
    <TextField
      label="Payment Due Day"
      type="number"
      value={editLeaseForm.payment_due_day}
      onChange={e => setEditLeaseForm({ ...editLeaseForm, payment_due_day: e.target.value })}
      fullWidth
    />
    <FormControl sx={{ width: '100%' }}>
      <InputLabel>Status</InputLabel>
      <Select value={editLeaseForm.status} label="Status" onChange={e => setEditLeaseForm({ ...editLeaseForm, status: e.target.value })} MenuProps={{ PaperProps: { sx: { width: 220 } } }}>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="terminated">Terminated</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
      </Select>
    </FormControl>
    <TextField label="Notes" value={editLeaseForm.notes} onChange={e => setEditLeaseForm({ ...editLeaseForm, notes: e.target.value })} fullWidth multiline minRows={2} sx={{ gridColumn: '1 / span 2' }} />
  </Box>
</DialogContent>
        
      <DialogActions>
          <Button onClick={handleCloseEditLeaseDialog}>Cancel</Button>
          <Button onClick={handleEditLeaseSubmit} variant="contained">Update Lease</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TenantsManagement;
