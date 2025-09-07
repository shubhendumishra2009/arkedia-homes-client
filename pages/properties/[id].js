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
  const [roomCategories, setRoomCategories] = useState([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`)
      .then(res => {
        setProperty(res.data.data || null);
        const fetchedRooms = res.data.data?.rooms || [];
        setRooms(fetchedRooms);
        
        // Group rooms by room_category and room_type to create categories
        const categories = {};
        fetchedRooms.forEach(room => {
          const category = room.room_category || 'Classic';
          const type = room.room_type || 'Single';
          const key = `${category}-${type}`;
          
          if (!categories[key]) {
            categories[key] = {
              category,
              type,
              rooms: [],
              image: room.image_urls?.[0] || `https://picsum.photos/seed/${key}/400/180`,
              hasAvailable: false,
              lowestPrice: Infinity
            };
          }
          
          categories[key].rooms.push(room);
          
          // Check availability
          if (room.status === 'available') {
            categories[key].hasAvailable = true;
            
            // Track lowest price
            if (room.base_rent && room.base_rent < categories[key].lowestPrice) {
              categories[key].lowestPrice = room.base_rent;
            }
          }
        });
        
        // Convert to array and sort by category and type
        const categoriesArray = Object.values(categories);
        categoriesArray.sort((a, b) => {
          if (a.category !== b.category) return a.category.localeCompare(b.category);
          return a.type.localeCompare(b.type);
        });
        
        setRoomCategories(categoriesArray);
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
            {property?.name || 'Property'} - Room Categories
          </Typography>
          
          {/* Room Categories Display */}
          <Grid container spacing={4} mt={2}>
            {roomCategories.length === 0 ? (
              <Grid item xs={12}>
                <Typography align="center">No room categories available for this property.</Typography>
              </Grid>
            ) : roomCategories.map((category, idx) => (
              <Grid item xs={12} sm={6} md={4} key={category.type}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.type}
                  />

                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.category} - {category.type} Rooms
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {category.rooms.length} room(s) in this category
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {category.hasAvailable ? 'Rooms available for booking' : 'No rooms available for booking'}
                    </Typography>
                    {category.hasAvailable && category.lowestPrice !== Infinity && (
                      <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom>
                        Starting from ₹{category.lowestPrice}/month
                      </Typography>
                    )}
                    
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        component={NextLink}
                        href={`/rooms?propertyId=${id}&category=${encodeURIComponent(category.category)}&type=${encodeURIComponent(category.type)}`}
                      >
                        View Details
                      </Button>
                      
                      {category.hasAvailable ? (
                        <Button
                          variant="contained"
                          color="primary"
                          component={NextLink}
                          href={`/book-room?propertyId=${id}&category=${encodeURIComponent(category.category)}&type=${encodeURIComponent(category.type)}`}
                        >
                          Book Now
                        </Button>
                      ) : (
                        <Tooltip title="No rooms available in this category" placement="top">
                          <span>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled
                              sx={{ opacity: 0.5, pointerEvents: 'none' }}
                            >
                              Book Now
                            </Button>
                          </span>
                        </Tooltip>
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
