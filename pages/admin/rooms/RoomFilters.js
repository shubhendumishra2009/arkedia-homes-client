import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

import { useState } from 'react';

export default function RoomFilters({
  properties = [],
  filter = {},
  setFilter = () => {},
  availableRoomNumbers = [],
  statusOptions = []
}) {
  const [propertyAnchorEl, setPropertyAnchorEl] = useState(null);
  const [roomNoAnchorEl, setRoomNoAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Property</InputLabel>
          <Select
            fullWidth
            MenuProps={{
              PaperProps: {
                sx: { width: propertyAnchorEl ? propertyAnchorEl.clientWidth : undefined }
              }
            }}
            value={filter?.property_id || ''}
            label="Property"
            onChange={e => setFilter(f => ({ ...f, property_id: e.target.value, room_no: '', status: '' }))}
            onOpen={e => setPropertyAnchorEl(e.currentTarget)}
            onClose={() => setPropertyAnchorEl(null)}
          >
            <MenuItem value="">All</MenuItem>
            {properties.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Room Number</InputLabel>
          <Select
            fullWidth
            MenuProps={{
              PaperProps: {
                sx: { width: roomNoAnchorEl ? roomNoAnchorEl.clientWidth : undefined }
              }
            }}
            value={filter?.room_no || ''}
            label="Room Number"
            onChange={e => setFilter(f => ({ ...f, room_no: e.target.value }))}
            disabled={!filter?.property_id}
            onOpen={e => setRoomNoAnchorEl(e.currentTarget)}
            onClose={() => setRoomNoAnchorEl(null)}
          >
            <MenuItem value="">All</MenuItem>
            {availableRoomNumbers.map(rn => (
              <MenuItem key={rn} value={rn}>{rn}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            fullWidth
            MenuProps={{
              PaperProps: {
                sx: { width: statusAnchorEl ? statusAnchorEl.clientWidth : undefined }
              }
            }}
            value={filter?.status || ''}
            label="Status"
            onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            disabled={!filter?.property_id}
            onOpen={e => setStatusAnchorEl(e.currentTarget)}
            onClose={() => setStatusAnchorEl(null)}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
