import React, { useState, useEffect } from 'react';
import styles from '@/styles/Admin.module.css';
import {
  Box,
  Tooltip,
  Alert,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultForm = {
  property_id: '',
  breakfast_price: '',
  lunch_price: '',
  dinner_price: '',
  status: 'active'
};

import DeleteIcon from '@mui/icons-material/Delete';

export default function MealTariffMaster() {
  const [tariffs, setTariffs] = useState([]);
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTariffs();
    fetchProperties();
  }, []);

  const fetchTariffs = async () => {
    try {
      const res = await axios.get(`${API_URL}/meal-tariff-master`);
      setTariffs(res.data);
    } catch (err) {
      // handle error
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties`);
      // Ensure properties is always an array
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
      }
      setProperties(data);
    } catch (err) {
      setProperties([]);
    }
  };

  const handleOpen = (tariff = null) => {
    if (tariff) {
      setForm({
        property_id: tariff.property_id,
        breakfast_price: tariff.breakfast_price,
        lunch_price: tariff.lunch_price,
        dinner_price: tariff.dinner_price,
        status: tariff.status
      });
      setEditId(tariff.id);
    } else {
      setForm(defaultForm);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API_URL}/meal-tariff-master/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/meal-tariff-master`, form);
      }
      fetchTariffs();
      handleClose();
    } catch (err) {
      // handle error
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal tariff?')) return;
    try {
      await axios.delete(`${API_URL}/meal-tariff-master/${id}`);
      fetchTariffs();
    } catch (err) {
      // handle error
    }
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Meal Tariff Master
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ boxShadow: 2, borderRadius: 2 }}
          >
            Add Tariff
          </Button>
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="meal tariff table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Property</TableCell>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Breakfast Price</TableCell>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Lunch Price</TableCell>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Dinner Price</TableCell>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ backgroundColor: '#bdbdbd', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tariffs.map((row, idx) => (
  <TableRow
    key={row.id}
    sx={{ backgroundColor: idx % 2 === 0 ? '#90caf9' : '#1976d2', color: idx % 2 === 0 ? 'inherit' : '#fff', '& td, & th': { color: idx % 2 === 0 ? 'inherit' : '#fff' } }}
  >
    <TableCell>{properties.find(p => p.id === row.property_id)?.name || row.property_id}</TableCell>
    <TableCell>{row.breakfast_price}</TableCell>
    <TableCell>{row.lunch_price}</TableCell>
    <TableCell>{row.dinner_price}</TableCell>
    <TableCell>{row.status}</TableCell>
    <TableCell>
      <Tooltip title="Edit Tariff" arrow>
        <IconButton
          color="primary"
          className={styles.secondaryButton}
          sx={{ ml: 1 }}
          onClick={() => handleOpen(row)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Tariff" arrow>
        <IconButton
          color="error"
          className={styles.accentButton}
          sx={{ ml: 1 }}
          onClick={() => handleDelete(row.id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Meal Tariff' : 'Add Meal Tariff'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Alert severity="info" icon={false} sx={{ fontSize: 15, py: 1, background: '#e3f2fd', color: '#1565c0' }}>
              All prices below are <strong>per day</strong> prices.
            </Alert>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Property</InputLabel>
                <Select
                  name="property_id"
                  value={form.property_id}
                  label="Property"
                  onChange={handleChange}
                >
                  {properties.map(p => (
                    <MenuItem key={p.id} value={p.id} disabled={!!tariffs.find(t => t.property_id === p.id && (!editId || (editId && form.property_id !== p.id)))}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="breakfast_price"
                label="Breakfast Price"
                type="number"
                fullWidth
                value={form.breakfast_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="lunch_price"
                label="Lunch Price"
                type="number"
                fullWidth
                value={form.lunch_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="dinner_price"
                label="Dinner Price"
                type="number"
                fullWidth
                value={form.dinner_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
