import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Grid, Divider, Chip } from '@mui/material';
import Link from 'next/link';

export default function RoomDetails() {
  const router = useRouter();
  const { roomId } = router.query;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    setError('');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`)
      .then(res => setRoom(res.data.data || null))
      .catch(() => setError('Failed to load room details.'))
      .finally(() => setLoading(false));
  }, [roomId]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Button component={Link} href={router.query.back || '/'} variant="outlined" sx={{ mb: 3 }}>Back</Button>
      {loading ? (
        <Typography align="center">Loading room details...</Typography>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : room ? (
        <Card>
          <CardMedia
            component="img"
            height="220"
            image={room.image_url || `https://picsum.photos/seed/room${room.id}/500/220`}
            alt={room.room_no || 'Room'}
          />
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" gutterBottom>
                Room Details
              </Typography>
              {room && (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  href={{ pathname: '/book-room', query: { roomId: room.id } }}
                  disabled={room.status !== 'available'}
                  sx={room.status !== 'available' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                >
                  Book Now
                </Button>
              )}
            </Box>
            <Typography variant="h5" gutterBottom>
              Room {room.room_no}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Category:</strong> {room.room_category} | <strong>Type:</strong> {room.room_type}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Status:</strong> {room.status}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Floor:</strong> {room.floor} | <strong>Area:</strong> {room.area_sqft} sqft
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Furnished:</strong> {room.is_furnished ? 'Yes' : 'No'} | <strong>AC:</strong> {room.has_ac ? 'Yes' : 'No'} | <strong>TV:</strong> {room.has_tv ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Internet:</strong> {room.has_internet ? 'Yes' : 'No'} | <strong>Balcony:</strong> {room.has_balcony ? 'Yes' : 'No'} | <strong>Private Bathroom:</strong> {room.has_private_bathroom ? 'Yes' : 'No'}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom><strong>Pricing</strong></Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Base Rent: ₹{room.base_rent || 'N/A'}</li>
                <li>Short Term: ₹{room.short_term_price || 'N/A'} | With Fooding: ₹{room.short_term_price_with_fooding || 'N/A'}</li>
                <li>Medium Term: ₹{room.medium_term_price || 'N/A'} | With Fooding: ₹{room.medium_term_price_with_fooding || 'N/A'}</li>
                <li>Long Term: ₹{room.long_term_price || 'N/A'} | With Fooding: ₹{room.long_term_price_with_fooding || 'N/A'}</li>
                <li>Breakfast Only: Short ₹{room.breakfast_only_short_term || 'N/A'}, Medium ₹{room.breakfast_only_medium_term || 'N/A'}, Long ₹{room.breakfast_only_long_term || 'N/A'}</li>
                <li>Lunch Only: Short ₹{room.lunch_only_short_term || 'N/A'}, Medium ₹{room.lunch_only_medium_term || 'N/A'}, Long ₹{room.lunch_only_long_term || 'N/A'}</li>
                <li>Dinner Only: Short ₹{room.dinner_only_short_term || 'N/A'}, Medium ₹{room.dinner_only_medium_term || 'N/A'}, Long ₹{room.dinner_only_long_term || 'N/A'}</li>
                <li>BF and Dinner: Short ₹{room.bf_and_dinner_short_term || 'N/A'}, Medium ₹{room.bf_and_dinner_medium_term || 'N/A'}, Long ₹{room.bf_and_dinner_long_term || 'N/A'}</li>
                <li>Lunch and Dinner: Short ₹{room.lunch_and_dinner_short_term || 'N/A'}, Medium ₹{room.lunch_and_dinner_medium_term || 'N/A'}, Long ₹{room.lunch_and_dinner_long_term || 'N/A'}</li>
              </ul>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              {room.description || 'No description'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography align="center">Room not found.</Typography>
      )}
    </Container>
  );
}
