import React from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { customScrollbarStyles } from '../ProjectUtils';

const PanelSection = ({ title, children, defaultExpanded = true, maxHeight = 'auto' }) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <Box sx={{ borderBottom: '1px solid #2a2a2a' }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          cursor: 'pointer',
          bgcolor: '#0d0d0d',
          '&:hover': { bgcolor: '#1a1a2e' },
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.85rem' }}>
          {title}
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: '#e0e0e0',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ExpandMore fontSize="small" />
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2, maxHeight, overflowY: 'auto', ...customScrollbarStyles }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PanelSection;