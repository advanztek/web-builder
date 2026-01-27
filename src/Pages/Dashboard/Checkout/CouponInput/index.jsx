import React from 'react';
import { Box, Grid, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { LocalOffer, CheckCircle } from '@mui/icons-material';

const CouponInput = ({
    couponCode,
    onChange,
    onApply,
    isApplied,
    theme
}) => {
    return (
        <>
            <Grid size={{ xs: 12 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <LocalOffer
                        sx={{
                            fontSize: 24,
                            color: theme.palette.success.main,
                            mr: 1,
                        }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                        Apply Coupon Code
                    </Typography>
                </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                    fullWidth
                    label="Coupon Code"
                    value={couponCode}
                    onChange={onChange}
                    placeholder="e.g., FIRST15"
                    disabled={isApplied}
                    InputProps={{
                        endAdornment: isApplied && (
                            <InputAdornment position="end">
                                <CheckCircle color="success" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onApply}
                    disabled={isApplied || !couponCode}
                    sx={{ height: 56 }}
                >
                    {isApplied ? 'Applied' : 'Apply'}
                </Button>
            </Grid>
        </>
    );
};

export default CouponInput;