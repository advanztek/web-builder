import React from 'react';
import { Box, useTheme } from '@mui/material';

const DecorativeBg = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
          bottom: '-50px',
          left: '-50px',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default DecorativeBg;