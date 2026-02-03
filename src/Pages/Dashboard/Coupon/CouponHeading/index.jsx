import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { GradientButton } from '../styles';

const CouponHeading = ({ onCreateClick }) => {
    return (
        <Box mb={4}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
            >
                <Box>
                    <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                            background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Coupon Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={0.5}>
                        Create, manage, and track promotional coupons
                    </Typography>
                </Box>
                <GradientButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateClick}
                >
                    Create Coupon
                </GradientButton>
            </Stack>
        </Box>
    );
};

export default CouponHeading;