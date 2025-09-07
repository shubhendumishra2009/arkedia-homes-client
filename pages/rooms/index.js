import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, Tooltip } from '@mui/material';
import NextLink from 'next/link';

export default function RoomsList() {
  const router = useRouter();
  const { propertyId, category, type } = router.query;
  const [rooms, setRooms] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    setError('');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`)
      .then(res => {
        setProperty(res.data.data || null);
        // Defensive mapping: ensure status is always present
        const roomsWithStatus = (res.data.data?.rooms || []).map(room => ({
          ...room,
          status: typeof room.status === 'string' ? room.status : 'unavailable', // fallback if status missing
        }));
        setRooms(roomsWithStatus);
        console.log('Fetched rooms:', roomsWithStatus);
      })
      .catch(() => setError('Failed to load property or rooms.'))
      .finally(() => setLoading(false));
  }, [propertyId]);
  
  // Filter rooms by category and type when rooms, category, or type changes
  useEffect(() => {
    if (rooms.length > 0) {
      let filtered = [...rooms];
      
      // Filter by category if provided
      if (category) {
        filtered = filtered.filter(room => room.room_category === category);
      }
      
      // Further filter by type if provided
      if (type) {
        filtered = filtered.filter(room => room.room_type === type);
      }
      
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms([]);
    }
  }, [rooms, category, type]);

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
            {property?.name || 'Property'} {category && type ? `- ${category} ${type} Rooms` : category ? `- ${category} Rooms` : type ? `- ${type} Rooms` : '- All Rooms'}
          </Typography>
          <Grid container spacing={4} mt={2}>
            {filteredRooms.length === 0 ? (
              <Grid item xs={12}>
                <Typography align="center">
                  {category && type ? `No ${category} ${type} rooms available.` : 
                   category ? `No ${category} rooms available.` : 
                   type ? `No ${type} rooms available.` : 
                   'No rooms available for this property.'}
                </Typography>
              </Grid>
            ) : filteredRooms.map((room, idx) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                {console.log('Room card:', room.id, 'status:', room.status)}
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
                      {room.room_category || 'Category'} | {room.room_type || 'Type'} | {room.status || 'Status'}
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom>
                      ₹{room.base_rent || 'N/A'}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {room.description || 'No description'}
                    </Typography>
                    <Box mt={2} display="flex" gap={1}>
                      <NextLink href={`/rooms/${room.id}`} passHref legacyBehavior>
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
