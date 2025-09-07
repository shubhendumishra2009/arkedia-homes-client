import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/properties')
      .then(res => setProperties(res.data.data || []))
      .catch(() => setError('Failed to load properties.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button component={Link} href="/" variant="outlined" sx={{ mb: 3 }}>Back to Home</Button>
      <Typography variant="h3" component="h2" align="center" gutterBottom>
        Our Properties
      </Typography>
      {loading ? (
        <Typography align="center">Loading properties...</Typography>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : (
        <Grid container spacing={4} mt={2}>
          {properties.map((property, index) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image_urls && property.image_urls.length > 0
                    ? property.image_urls[0]
                    : (index === 1
                        ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
                        : index === 4
                          ? 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
                          : `https://picsum.photos/seed/property${property.id}/400/200`)
                  }
                  alt={property.name}
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {property.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {property.location} - {property.address}
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href={`/properties/${property.id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
