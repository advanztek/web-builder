import React from 'react';
import { Box, Container, Grid, useTheme, Fade } from '@mui/material';
import PageHeader from '../../../Components/PageHeader';
import { useCheckout } from './UseCheckout';
import NotifySnackbar from '../../../Components/NotifySnackBar';
import PaymentForm from './PaymentForm';

const CheckoutPage = () => {
    const theme = useTheme();
    const {
        credits,
        price,
        formData,
        processing,
        discount,
        couponApplied,
        snackbar,
        initLoading,
        calculateTotal,
        handleInputChange,
        handleApplyCoupon,
        handleSubmit,
        handleBack,
        handleCloseSnackbar,
    } = useCheckout();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                pt: 4,
                pb: 6,
            }}
        >
            <Container maxWidth="lg">
                <PageHeader onBack={handleBack} buttonText='Back to packages' theme={theme} />

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Fade in timeout={800}>
                            <PaymentForm
                                credits={credits}
                                price={price}
                                discount={discount}
                                couponCode={formData.couponCode}
                                couponApplied={couponApplied}
                                onCouponChange={handleInputChange('couponCode')}
                                onApplyCoupon={handleApplyCoupon}
                                onSubmit={handleSubmit}
                                processing={processing}
                                initLoading={initLoading}
                                calculateTotal={calculateTotal}
                                theme={theme}
                            />
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            <NotifySnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </Box>
    );
};

export default CheckoutPage;