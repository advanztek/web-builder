import React from 'react';
import { Box, useTheme } from '@mui/material';

const CTAButton = ({ children, href = '#', variant = 'primary', onClick }) => {
    const theme = useTheme();

    const isPrimary = variant === 'primary';

    return (
        <Box
            component="a"
            href={href}
            onClick={onClick}
            sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                backgroundColor: isPrimary
                    ? theme.palette.primary.main
                    : 'transparent',
                color: isPrimary
                    ? theme.palette.primary.contrastText
                    : theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                display: 'inline-block',
                border: isPrimary
                    ? 'none' :
                    `2px solid ${theme.palette.primary.main}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: isPrimary ?
                        theme.palette.primary.dark :
                        theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    transform: 'translateY(-2px)',
                    boxShadow: isPrimary ?
                        `0 4px 12px ${theme.palette.primary.main}40` : 'none',
                },
            }}
        >
            {children}
        </Box>
    );
};

export default CTAButton;
