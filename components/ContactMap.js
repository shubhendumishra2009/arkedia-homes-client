import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import the MapContainer to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const ContactMap = ({ latitude, longitude }) => {
  // This effect ensures the map is properly sized after component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import Leaflet CSS
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');
      
      // Fix for default icon in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon-2x.png',
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
      });
    }
  }, []);

  if (typeof window === 'undefined') {
    return <Box sx={{ height: '400px', bgcolor: '#f5f5f5', borderRadius: 2 }} />;
  }

  return (
    <Box sx={{ height: '400px', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={17} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            Arkedia Homes<br />
            Nanda Lane, Kuluthkani<br />
            Dhanupali, Sambalpur
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default ContactMap;
