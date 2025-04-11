import { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Tabs, Tab, Button, Dialog, DialogContent, IconButton, Chip } from '@mui/material';
import Head from 'next/head';
import CloseIcon from '@mui/icons-material/Close';


// Room type data
const roomTypes = [
  {
    id: 1,
    type: 'Single Room',
    description: 'Cozy and comfortable single rooms perfect for individuals. Features include a comfortable bed, study desk, wardrobe, and essential amenities.',
    price: 'From $800/month',
    images: [
      { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304', alt: 'Single Room 1' },
      { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457', alt: 'Single Room 2' },
      { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf', alt: 'Single Room 3' }
    ],
    features: ['250 sq.ft', 'Single Bed', 'Study Desk', 'Wardrobe', 'Wi-Fi', 'Shared Bathroom']
  },
  {
    id: 2,
    type: 'Double Room',
    description: 'Spacious double rooms ideal for those who prefer more space. Includes a larger bed, expanded storage, and additional seating area.',
    price: 'From $1,200/month',
    images: [
      { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', alt: 'Double Room 1' },
      { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf', alt: 'Double Room 2' },
      { src: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8', alt: 'Double Room 3' }
    ],
    features: ['350 sq.ft', 'Queen Bed', 'Work Desk', 'Wardrobe', 'Wi-Fi', 'Private Bathroom', 'Balcony']
  },
  {
    id: 3,
    type: 'Deluxe Room',
    description: 'Premium deluxe rooms with enhanced amenities and comfort. Features include a larger living space, premium furnishings, and additional amenities.',
    price: 'From $1,500/month',
    images: [
      { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Deluxe Room 1' },
      { src: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc', alt: 'Deluxe Room 2' },
      { src: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d', alt: 'Deluxe Room 3' }
    ],
    features: ['450 sq.ft', 'King Bed', 'Work Desk', 'Walk-in Wardrobe', 'High-Speed Wi-Fi', 'Private Bathroom', 'Balcony', 'Mini Refrigerator', 'TV']
  },
  {
    id: 4,
    type: 'Suite',
    description: 'Luxurious suites offering the ultimate comfort and space. Includes a separate living area, premium amenities, and panoramic views.',
    price: 'From $1,800/month',
    images: [
      { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461', alt: 'Suite 1' },
      { src: 'https://images.unsplash.com/photo-1591088398332-8a7791972843', alt: 'Suite 2' },
      { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a', alt: 'Suite 3' }
    ],
    features: ['550 sq.ft', 'King Bed', 'Separate Living Area', 'Walk-in Wardrobe', 'High-Speed Wi-Fi', 'Luxury Bathroom', 'Large Balcony', 'Refrigerator', 'Smart TV', 'Coffee Maker']
  }
];

// Amenities data
const amenities = [
  {
    id: 1,
    name: 'Fitness Center',
    description: 'State-of-the-art fitness center with modern equipment, open 24/7 for residents.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
  },
  {
    id: 2,
    name: 'Rooftop Lounge',
    description: 'Relaxing rooftop lounge with comfortable seating and panoramic city views.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd'
  },
  {
    id: 3,
    name: 'Coworking Space',
    description: 'Dedicated coworking space with high-speed internet, printing facilities, and meeting rooms.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
  },
  {
    id: 4,
    name: 'Laundry Facilities',
    description: 'Modern laundry facilities with washing machines and dryers available 24/7.',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f'
  },
  {
    id: 5,
    name: 'Community Kitchen',
    description: 'Fully equipped community kitchen for residents to prepare meals and socialize.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba'
  },
  {
    id: 6,
    name: 'Garden Area',
    description: 'Beautifully maintained garden area with seating for relaxation and outdoor activities.',
    image: 'https://images.unsplash.com/photo-1558293842-c0fd3db86157'
  }
];

export default function Gallery() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Head>
        <title>Gallery | Arkedia Homes</title>
        <meta name="description" content="Explore our room types and amenities at Arkedia Homes" />
      </Head>

      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Gallery
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Explore our premium room types and amenities designed for comfortable living
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Room Types" />
              <Tab label="Amenities" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={4}>
              {roomTypes.map((room) => (
                <Grid item key={room.id} xs={12} md={6}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={`${room.images[0].src}?auto=format&fit=crop&w=800&q=80`}
                      alt={room.images[0].alt}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenDialog(room.images[0])}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {room.type}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {room.price}
                      </Typography>
                      <Typography paragraph>
                        {room.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Features:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {room.features.map((feature, index) => (
                          <Chip key={index} label={feature} size="small" />
                        ))}
                      </Box>
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        {room.images.slice(1).map((image, index) => (
                          <Grid item xs={6} key={index}>
                            <Box
                              component="img"
                              src={`${image.src}?auto=format&fit=crop&w=400&q=60`}
                              alt={image.alt}
                              sx={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                              onClick={() => handleOpenDialog(image)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={4}>
              {amenities.map((amenity) => (
                <Grid item key={amenity.id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${amenity.image}?auto=format&fit=crop&w=600&q=80`}
                      alt={amenity.name}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenDialog({ src: amenity.image, alt: amenity.name })}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {amenity.name}
                      </Typography>
                      <Typography>
                        {amenity.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" href="/contact">
              Contact Us for Viewing
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Image Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box
              component="img"
              src={`${selectedImage.src}?auto=format&fit=contain&w=1200&q=90`}
              alt={selectedImage.alt}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}