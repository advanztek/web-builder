import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    Divider,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    Snackbar,
    Chip,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Fade,
    CircularProgress,
} from '@mui/material';
import {
    CreditCard,
    ArrowBack,
    ShoppingCart,
    LocalOffer,
    CheckCircle,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';

const CheckoutPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const credits = searchParams.get('credits') || '0';
    const price = searchParams.get('price') || '0';

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        email: '',
        voucherCode: '',
        couponCode: '',
    });

    const [showCvv, setShowCvv] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [voucherApplied, setVoucherApplied] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const months = [
        '01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12'
    ];

    const years = Array.from({ length: 10 }, (_, i) =>
        (new Date().getFullYear() + i).toString()
    );

    const handleInputChange = (field) => (event) => {
        let value = event.target.value;

        // Format card number with spaces
        if (field === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            value = value.substring(0, 19); // Max 16 digits + 3 spaces
        }

        // CVV max 4 digits
        if (field === 'cvv') {
            value = value.replace(/\D/g, '').substring(0, 4);
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApplyVoucher = () => {
        if (formData.voucherCode.trim()) {
            // Simulate voucher validation
            const validVouchers = {
                'WELCOME10': 10,
                'SAVE20': 20,
                'HALF50': 50,
            };

            const discountPercent = validVouchers[formData.voucherCode.toUpperCase()];

            if (discountPercent) {
                setDiscount(prev => prev + discountPercent);
                setVoucherApplied(true);
                setSnackbar({
                    open: true,
                    message: `Voucher applied! ${discountPercent}% discount added.`,
                    severity: 'success',
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Invalid voucher code.',
                    severity: 'error',
                });
            }
        }
    };

    const handleApplyCoupon = () => {
        if (formData.couponCode.trim()) {
            // Simulate coupon validation
            const validCoupons = {
                'FIRST15': 15,
                'LOYALTY25': 25,
                'VIP30': 30,
            };

            const discountPercent = validCoupons[formData.couponCode.toUpperCase()];

            if (discountPercent) {
                setDiscount(prev => prev + discountPercent);
                setCouponApplied(true);
                setSnackbar({
                    open: true,
                    message: `Coupon applied! ${discountPercent}% discount added.`,
                    severity: 'success',
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Invalid coupon code.',
                    severity: 'error',
                });
            }
        }
    };

    const calculateTotal = () => {
        const originalPrice = parseFloat(price);
        const discountAmount = (originalPrice * discount) / 100;
        return (originalPrice - discountAmount).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.cardNumber || !formData.cardName || !formData.expiryMonth ||
            !formData.expiryYear || !formData.cvv || !formData.email) {
            setSnackbar({
                open: true,
                message: 'Please fill in all payment details.',
                severity: 'error',
            });
            return;
        }

        setProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            setSnackbar({
                open: true,
                message: `Successfully purchased ${credits} credits!`,
                severity: 'success',
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }, 2500);
    };

    const handleBack = () => {
        navigate('/dashboard/buy-credits');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

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
                {/* Header */}
                <Fade in timeout={600}>
                    <Box sx={{ mb: 4 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            sx={{
                                mb: 2,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            Back to Packages
                        </Button>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                mb: 1,
                            }}
                        >
                            Complete Your Purchase
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Secure checkout powered by industry-standard encryption
                        </Typography>
                    </Box>
                </Fade>

                <Grid container spacing={4}>
                    {/* Payment Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Fade in timeout={800}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: theme.shadows[3],
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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

                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            {/* Email */}
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange('email')}
                                                    required
                                                    placeholder="your@email.com"
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            {/* Card Number */}
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Card Number"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange('cardNumber')}
                                                    required
                                                    placeholder="1234 5678 9012 3456"
                                                    variant="outlined"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CreditCard color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            {/* Card Name */}
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Cardholder Name"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange('cardName')}
                                                    required
                                                    placeholder="JOHN DOE"
                                                    variant="outlined"
                                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                                />
                                            </Grid>

                                            {/* Expiry Date */}
                                            <Grid size={{ xs: 6 }}>
                                                <FormControl fullWidth required>
                                                    <InputLabel>Expiry Month</InputLabel>
                                                    <Select
                                                        value={formData.expiryMonth}
                                                        onChange={handleInputChange('expiryMonth')}
                                                        label="Expiry Month"
                                                    >
                                                        {months.map(month => (
                                                            <MenuItem key={month} value={month}>
                                                                {month}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ xs: 6 }}>
                                                <FormControl fullWidth required>
                                                    <InputLabel>Expiry Year</InputLabel>
                                                    <Select
                                                        value={formData.expiryYear}
                                                        onChange={handleInputChange('expiryYear')}
                                                        label="Expiry Year"
                                                    >
                                                        {years.map(year => (
                                                            <MenuItem key={year} value={year}>
                                                                {year}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {/* CVV */}
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="CVV"
                                                    type={showCvv ? 'text' : 'password'}
                                                    value={formData.cvv}
                                                    onChange={handleInputChange('cvv')}
                                                    required
                                                    placeholder="123"
                                                    variant="outlined"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowCvv(!showCvv)}
                                                                    edge="end"
                                                                >
                                                                    {showCvv ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12 }}>
                                                <Divider sx={{ my: 2 }} />
                                            </Grid>

                                            {/* Voucher Code */}
                                            <Grid size={{ xs: 12 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <LocalOffer
                                                        sx={{ fontSize: 24, color: theme.palette.success.main, mr: 1 }}
                                                    />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Apply Voucher or Coupon
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Voucher Code"
                                                    value={formData.voucherCode}
                                                    onChange={handleInputChange('voucherCode')}
                                                    placeholder="e.g., WELCOME10"
                                                    variant="outlined"
                                                    disabled={voucherApplied}
                                                    InputProps={{
                                                        endAdornment: voucherApplied && (
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
                                                    onClick={handleApplyVoucher}
                                                    disabled={voucherApplied || !formData.voucherCode}
                                                    sx={{ height: '56px' }}
                                                >
                                                    {voucherApplied ? 'Applied' : 'Apply'}
                                                </Button>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Coupon Code"
                                                    value={formData.couponCode}
                                                    onChange={handleInputChange('couponCode')}
                                                    placeholder="e.g., FIRST15"
                                                    variant="outlined"
                                                    disabled={couponApplied}
                                                    InputProps={{
                                                        endAdornment: couponApplied && (
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
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponApplied || !formData.couponCode}
                                                    sx={{ height: '56px' }}
                                                >
                                                    {couponApplied ? 'Applied' : 'Apply'}
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ mt: 4 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={processing}
                                                startIcon={processing ? <CircularProgress size={20} /> : <ShoppingCart />}
                                                sx={{
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #09040eff 0%, #011981ff 100%)',
                                                    },
                                                }}
                                            >
                                                {processing ? 'Processing...' : `Pay $${calculateTotal()}`}
                                            </Button>
                                        </Box>
                                    </form>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Fade in timeout={1000}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: theme.shadows[3],
                                    position: 'sticky',
                                    top: 20,
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        Order Summary
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mb: 3 }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                                borderRadius: 2,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                                                You're purchasing
                                            </Typography>
                                            <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                                {parseInt(credits).toLocaleString()}
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                Credits
                                            </Typography>
                                        </Paper>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Subtotal
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                ${parseFloat(price).toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {discount > 0 && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" color="success.main">
                                                        Discount
                                                    </Typography>
                                                    <Chip
                                                        label={`${discount}%`}
                                                        size="small"
                                                        color="success"
                                                        sx={{ height: 20 }}
                                                    />
                                                </Box>
                                                <Typography variant="body1" fontWeight={600} color="success.main">
                                                    -${((parseFloat(price) * discount) / 100).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                Total
                                            </Typography>
                                            <Typography variant="h6" fontWeight={700} color="primary">
                                                ${calculateTotal()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Credits will be added to your account immediately after payment.
                                    </Alert>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                            <strong>Try these codes:</strong>
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Vouchers: WELCOME10, SAVE20, HALF50
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Coupons: FIRST15, LOYALTY25, VIP30
                                        </Typography>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CheckoutPage;