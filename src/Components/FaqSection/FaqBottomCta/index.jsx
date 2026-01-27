import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CTAButton from '../CTABtn';

const FaqBottomCta = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mt: 8,
                p: 4,
                borderRadius: '20px',
                background:
                    theme.palette.mode === 'light'
                        ? `linear-gradient(135deg, 
                ${theme.palette.primary.main}10 0%,
                ${theme.palette.secondary.main}10 100%)`
                        : `linear-gradient(135deg,
                ${theme.palette.primary.lightBg} 0%, 
                ${theme.palette.primary.bg} 100%)`,
                border: `2px solid ${theme.palette.divider}`,
                textAlign: 'center',
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: theme.palette.text.primary,
                }}
            >
                Still have questions?
            </Typography>
            <Typography
                sx={{
                    fontSize: '15px',
                    color: theme.palette.text.secondary,
                    mb: 3,
                }}
            >
                Can't find the answer you're looking for? Our support team is here to help.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <CTAButton variant="primary">Contact Support</CTAButton>
                <CTAButton variant="outline">View Documentation</CTAButton>
            </Box>
        </Box>
    );
};

export default FaqBottomCta;