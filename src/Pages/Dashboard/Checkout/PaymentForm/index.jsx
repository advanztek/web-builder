import React from 'react';
import { Card, CardContent, Box, Typography, Grid, Divider } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import PackageSummary from '../PackageSummary';
import CouponInput from '../CouponInput';
import PaymentBtn from '../PaymentBtn';

const PaymentForm = ({
    credits,
    price,
    discount,
    couponCode,
    couponApplied,
    onCouponChange,
    onApplyCoupon,
    onSubmit,
    processing,
    initLoading,
    calculateTotal,
    theme,
}) => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[3],
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <CreditCard
                        sx={{
                            fontSize: 32,
                            color: theme.palette.primary.main,
                            mr: 2,
                        }}
                    />
                    <Typography variant="h5" fontWeight={700}>
                        Payment Details
                    </Typography>
                </Box>

                <PackageSummary
                    credits={credits}
                    price={price}
                    discount={discount}
                />

                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                        </Grid>

                        <CouponInput
                            couponCode={couponCode}
                            onChange={onCouponChange}
                            onApply={onApplyCoupon}
                            isApplied={couponApplied}
                            theme={theme}
                        />
                    </Grid>

                    <PaymentBtn
                        amount={calculateTotal}
                        isProcessing={processing}
                        isLoading={initLoading}
                    />
                </form>
            </CardContent>
        </Card>
    );
};

export default PaymentForm;