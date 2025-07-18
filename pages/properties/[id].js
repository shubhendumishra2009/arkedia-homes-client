import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, Tooltip } from '@mui/material';
import NextLink from 'next/link';

export default function PropertyRooms() {
  const router = useRouter();
  const { id } = router.query;
  const [rooms, setRooms] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`)
      .then(res => {
        setProperty(res.data.data || null);
        setRooms(res.data.data?.rooms || []);
      })
      .catch(() => setError('Failed to load property or rooms.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <NextLink href="/properties" passHref legacyBehavior>
        <Button variant="outlined" sx={{ mb: 3 }}>Back to Properties</Button>
      </NextLink>
      {loading ? (
        <Typography align="center">Loading rooms...</Typography>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom align="center">
            {property?.name || 'Property'} - Rooms
          </Typography>
          <Grid container spacing={4} mt={2}>
            {rooms.length === 0 ? (
              <Grid item xs={12}>
                <Typography align="center">No rooms available for this property.</Typography>
              </Grid>
            ) : rooms.map((room, idx) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="180"
                    image={room.image_url || `https://picsum.photos/seed/room${room.id}/400/180`}
                    alt={room.room_no || 'Room'}
                  />

                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Room {room.room_no}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {room.room_type || 'Room Type'} | {room.status || 'Status'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {room.description || 'No description'}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      <NextLink href={{ pathname: `/rooms/${room.id}`, query: { back: `/properties/${id}` } }} passHref legacyBehavior>
                        <Button
                          variant="outlined"
                          size="small"
                        >
                          View Details
                        </Button>
                      </NextLink>
                      {room.status !== 'available' ? (
                        <Tooltip title={`Booking not available: Room is ${room.status || 'unavailable'}`} placement="top">
                          <span>
                            <NextLink href={{ pathname: '/book-room', query: { roomId: room.id } }} passHref legacyBehavior>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                disabled
                                sx={{ opacity: 0.5, pointerEvents: 'none' }}
                              >
                                Book Now
                              </Button>
                            </NextLink>
                          </span>
                        </Tooltip>
                      ) : (
                        <NextLink href={{ pathname: '/book-room', query: { roomId: room.id } }} passHref legacyBehavior>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                          >
                            Book Now
                          </Button>
                        </NextLink>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
