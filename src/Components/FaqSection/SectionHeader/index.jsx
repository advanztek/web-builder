import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const SectionHeader = ({ title, subtitle, icon: Icon = HelpOutline }) => {
    const theme = useTheme();

    return (
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                }}
            >
                <Icon sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
            </Box>

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: '32px', md: '42px' },
                    mb: 2,
                    color: theme.palette.text.heading,
                }}
            >
                {title}
            </Typography>
            <Typography
                sx={{
                    fontSize: '18px',
                    color: theme.palette.text.secondary,
                    maxWidth: '600px',
                    mx: 'auto',
                }}
            >
                {subtitle}
            </Typography>
        </Box>
    );
};

export default SectionHeader;