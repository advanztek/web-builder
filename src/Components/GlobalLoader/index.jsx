import React from 'react';
import { Box, Typography, Fade, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';

// Pulse animation
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
`;

// Bounce animation
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

// Rotate animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Wave animation
const wave = keyframes`
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
`;

// Fade in/out animation
const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
`;

// Orbit animation
const orbit = keyframes`
  from {
    transform: rotate(0deg) translateX(30px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(30px) rotate(-360deg);
  }
`;

const GlobalLoader = ({ 
  open, 
  message = "Loading...", 
  variant = "gradient" // gradient, dots, spinner, pulse, wave, orbit
}) => {
  if (!open) return null;

  const renderLoader = () => {
    switch (variant) {
      case 'gradient':
        return (
          <Box sx={{ position: 'relative', width: 120, height: 120 }}>
            {/* Outer ring */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: `${rotate} 2s linear infinite`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 8,
                  borderRadius: '50%',
                  background: 'rgba(20, 25, 36, 0.95)',
                }
              }}
            />
            
            {/* Inner pulse circle */}
            <Box
              sx={{
                position: 'absolute',
                inset: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: `${pulse} 2s ease-in-out infinite`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  animation: `${pulse} 1.5s ease-in-out infinite`,
                }}
              />
            </Box>
          </Box>
        );

      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  animation: `${bounce} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </Box>
        );

      case 'spinner':
        return (
          <Box sx={{ position: 'relative', width: 100, height: 100 }}>
            <CircularProgress
              size={100}
              thickness={2}
              sx={{
                color: 'transparent',
                position: 'absolute',
                '& .MuiCircularProgress-circle': {
                  stroke: 'url(#gradient)',
                  strokeLinecap: 'round',
                }
              }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  animation: `${pulse} 1.5s ease-in-out infinite`,
                }}
              />
            </Box>
          </Box>
        );

      case 'pulse':
        return (
          <Box sx={{ position: 'relative', width: 100, height: 100 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '3px solid',
                  borderColor: '#667eea',
                  animation: `${pulse} 2s ease-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
            <Box
              sx={{
                position: 'absolute',
                inset: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            />
          </Box>
        );

      case 'wave':
        return (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', height: 60 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 60,
                  borderRadius: 4,
                  background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                  animation: `${wave} 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: 'center',
                }}
              />
            ))}
          </Box>
        );

      case 'orbit':
        return (
          <Box sx={{ position: 'relative', width: 100, height: 100 }}>
            {/* Center circle */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: `${pulse} 2s ease-in-out infinite`,
              }}
            />
            
            {/* Orbiting circles */}
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#764ba2',
                  animation: `${orbit} 2s linear infinite`,
                  animationDelay: `${i * 0.66}s`,
                }}
              />
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Fade in={open} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(20, 25, 36, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          gap: 3,
        }}
      >
        {renderLoader()}
        
        {message && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 500,
              textAlign: 'center',
              animation: `${fadeInOut} 2s ease-in-out infinite`,
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default GlobalLoader;