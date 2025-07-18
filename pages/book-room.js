import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Alert, Card, CardContent, CardMedia, Divider } from '@mui/material';

export default function BookRoom() {
  const router = useRouter();
  const { roomId } = router.query;
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    lease_start_date: '',
    lease_end_date: '',
    booking_amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Room and property details
  const [room, setRoom] = useState(null);
  const [property, setProperty] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState('');

  useEffect(() => {
    if (!roomId) return;
    setDetailsLoading(true);
    setDetailsError('');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`)
      .then(res => {
        setRoom(res.data.data || null);
        if (res.data.data?.booking_amount) {
          setForm(prev => ({ ...prev, booking_amount: res.data.data.booking_amount }));
        }
        if (res.data.data?.property_id) {
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties/${res.data.data.property_id}`)
            .then(res2 => setProperty(res2.data.data || null))
            .catch(() => setProperty(null));
        } else {
          setProperty(null);
        }
      })
      .catch(() => setDetailsError('Could not load room details.'))
      .finally(() => setDetailsLoading(false));
  }, [roomId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/book-tenant`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        room_id: roomId,
        property_id: room?.property_id,
        lease_start_date: form.lease_start_date,
        lease_end_date: form.lease_end_date,
        rent_amount: form.booking_amount,
        security_deposit: room?.security_deposit,
        payment_due_day: 1, // default or can add to form if needed
        notes: '' // extend if you want to collect notes
      });
      setSuccess('Room booked successfully!');
      setForm({ name: '', email: '', phone: '', lease_start_date: '', lease_end_date: '', booking_amount: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => {
          if (room && room.property_id) {
            router.push(`/rooms?propertyId=${room.property_id}`);
          } else {
            router.push('/rooms');
          }
        }}
      >
        Back to Rooms
      </Button>
      <Typography variant="h4" gutterBottom align="center">Book Room</Typography>
      {detailsLoading ? (
        <Typography align="center">Loading room and property details...</Typography>
      ) : detailsError ? (
        <Alert severity="error" sx={{ mb: 2 }}>{detailsError}</Alert>
      ) : room && property ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Room & Property Details</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography><strong>Property:</strong> {property.name} ({property.location})</Typography>
              <Typography><strong>Address:</strong> {property.address}</Typography>
              <Typography><strong>Room:</strong> {room.room_no} ({room.room_category}, {room.room_type})</Typography>
              <Typography><strong>Floor:</strong> {room.floor} | <strong>Area:</strong> {room.area_sqft} sqft</Typography>
              <Typography><strong>Furnished:</strong> {room.is_furnished ? 'Yes' : 'No'} | <strong>AC:</strong> {room.has_ac ? 'Yes' : 'No'} | <strong>TV:</strong> {room.has_tv ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Status:</strong> {room.status}</Typography>
              <Typography><strong>Base Rent:</strong> ₹{room.base_rent}</Typography>
              <Typography><strong>Security Deposit:</strong> ₹{room.security_deposit}</Typography>
            </Box>
          </CardContent>
        </Card>
      ) : null}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth />
        <TextField label="Lease Start Date" name="lease_start_date" type="date" value={form.lease_start_date} onChange={handleChange} required InputLabelProps={{ shrink: true }} fullWidth />
        <TextField label="Lease End Date" name="lease_end_date" type="date" value={form.lease_end_date} onChange={handleChange} required InputLabelProps={{ shrink: true }} fullWidth />
        <TextField label="Booking Amount" name="booking_amount" value={form.booking_amount} disabled fullWidth type="number" />
        {/* Hidden input to submit booking_amount since disabled fields are not submitted */}
        <input type="hidden" name="booking_amount" value={form.booking_amount} />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? 'Booking...' : 'Book Now'}</Button>
      </Box>
    </Container>
  );
}
