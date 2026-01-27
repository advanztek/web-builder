import React from 'react';
import { Box, Typography, TextField, Select, MenuItem } from '@mui/material';

const PropertyField = ({ label, type = 'text', value, onChange, options = [] }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: '#a0a0a0', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
        {label}
      </Typography>
      {type === 'select' ? (
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          sx={{
            bgcolor: '#1a1a2e',
            color: '#e0e0e0',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a2a' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      ) : type === 'color' ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            sx={{ width: 50 }}
          />
          <TextField
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            fullWidth
            sx={{
              bgcolor: '#1a1a2e',
              '& .MuiOutlinedInput-root': {
                color: '#e0e0e0',
                '& fieldset': { borderColor: '#2a2a2a' },
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
            }}
          />
        </Box>
      ) : (
        <TextField
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          sx={{
            bgcolor: '#1a1a2e',
            '& .MuiOutlinedInput-root': {
              color: '#e0e0e0',
              '& fieldset': { borderColor: '#2a2a2a' },
              '&:hover fieldset': { borderColor: '#667eea' },
              '&.Mui-focused fieldset': { borderColor: '#667eea' },
            },
          }}
        />
      )}
    </Box>
  );
};

export default PropertyField;