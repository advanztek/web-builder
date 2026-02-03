import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateCoupon,
    useUpdateCoupon,
    useGetCouponData,
} from '../../../../Hooks/coupon';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    TextField,
    Typography,
    Fade,
    alpha,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    CalendarToday as CalendarTodayIcon,
    Percent as PercentIcon,
    AttachMoney as AttachMoneyIcon,
    Tag as TagIcon,
    People as PeopleIcon,
    ShoppingBag as ShoppingBagIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { safeDecodeId, encodeId } from '../../../../Utils/IdUtils';

const StyledCard = styled(Card)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        boxShadow: theme.shadows[4],
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    paddingBottom: theme.spacing(1.5),
    borderBottom: `2px solid ${theme.palette.divider}`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: '10px 24px',
    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8],
    },
    '&:disabled': {
        background: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const ServiceChip = styled(Chip)(({ theme, selected }) => ({
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    ...(selected && {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.common.white,
        borderColor: theme.palette.primary.main,
        '& .MuiChip-deleteIcon': {
            color: theme.palette.common.white,
            '&:hover': {
                color: alpha(theme.palette.common.white, 0.8),
            },
        },
    }),
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

const ViewOnlyBadge = styled(Chip)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: '0.875rem',
    padding: '4px 12px',
}));



const hashId = (id) => {
    try {
        return btoa(id.toString());
    } catch (e) {
        console.error('Error hashing ID:', e);
        return id;
    }
};

const CouponForm = ({ mode = 'create' }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const decodedId = React.useMemo(() => {
        return safeDecodeId(id);
    }, [id]);


    const { createCoupon, loading: createLoading } = useCreateCoupon();
    const { updateCoupon, loading: updateLoading } = useUpdateCoupon();

    const { couponData, loading: fetchLoading, error: fetchError } = useGetCouponData(
        decodedId,
        mode
    );

    const [formData, setFormData] = useState({
        discount_type: 'percentage',
        discount_value: '',
        min_purchase_amount: '',
        max_discount_amount: '',
        usage_limit: '',
        user_limit: 1,
        valid_from: '',
        valid_until: '',
        applicable_services: [],
        status: true,
    });

    const [errors, setErrors] = useState({});
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';

    const serviceOptions = [
        { value: 'subscription', label: 'Subscription' },
        { value: 'consultation', label: 'Consultation' },
        { value: 'premium_features', label: 'Premium Features' },
        { value: 'courses', label: 'Courses' },
        { value: 'add_ons', label: 'Add-ons' },
    ];

    // ==================== HELPER FUNCTIONS ====================
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (couponData && (mode === 'edit' || mode === 'view')) {
            setFormData({
                code: couponData.code || '',
                discount_type: couponData.discount_type || 'percentage',
                discount_value: couponData.discount_value?.toString() || '',
                min_purchase_amount: couponData.min_purchase_amount?.toString() || '',
                max_discount_amount: couponData.max_discount_amount?.toString() || '',
                usage_limit: couponData.usage_limit?.toString() || '',
                user_limit: couponData.user_limit?.toString() || '1',
                valid_from: formatDateTimeLocal(couponData.valid_from),
                valid_until: formatDateTimeLocal(couponData.valid_until),
                applicable_services: Array.isArray(couponData.applicable_services)
                    ? couponData.applicable_services
                    : [],
                status: couponData.status ?? true,
            });
        }
    }, [couponData, mode]);

    // ==================== EVENT HANDLERS ====================
    const handleChange = (e) => {
        if (isViewMode) return;

        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const toggleService = (service) => {
        if (isViewMode) return;

        setFormData((prev) => ({
            ...prev,
            applicable_services: prev.applicable_services.includes(service)
                ? prev.applicable_services.filter((s) => s !== service)
                : [...prev.applicable_services, service],
        }));

        if (errors.applicable_services) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.applicable_services;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Discount value validation
        if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
            newErrors.discount_value = 'Discount value must be greater than 0';
        }

        if (formData.discount_type === 'percentage' && parseFloat(formData.discount_value) > 100) {
            newErrors.discount_value = 'Percentage cannot exceed 100%';
        }

        // Usage limit validation
        if (!formData.usage_limit || parseInt(formData.usage_limit) <= 0) {
            newErrors.usage_limit = 'Usage limit must be greater than 0';
        }

        // User limit validation
        if (!formData.user_limit || parseInt(formData.user_limit) <= 0) {
            newErrors.user_limit = 'User limit must be greater than 0';
        }

        // Date validation
        if (!formData.valid_from) {
            newErrors.valid_from = 'Start date is required';
        }

        if (!formData.valid_until) {
            newErrors.valid_until = 'End date is required';
        }

        if (formData.valid_from && formData.valid_until) {
            const startDate = new Date(formData.valid_from);
            const endDate = new Date(formData.valid_until);
            const now = new Date();

            if (endDate <= startDate) {
                newErrors.valid_until = 'End date must be after start date';
            }

            if (isCreateMode && startDate < now) {
                newErrors.valid_from = 'Start date cannot be in the past';
            }
        }

        // Services validation
        if (formData.applicable_services.length === 0) {
            newErrors.applicable_services = 'At least one service must be selected';
        }

        // Optional field validations
        if (formData.min_purchase_amount && parseFloat(formData.min_purchase_amount) < 0) {
            newErrors.min_purchase_amount = 'Minimum purchase amount cannot be negative';
        }

        if (formData.max_discount_amount && parseFloat(formData.max_discount_amount) < 0) {
            newErrors.max_discount_amount = 'Maximum discount amount cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ==================== FORM SUBMISSION ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isViewMode) return;

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value),
                min_purchase_amount: formData.min_purchase_amount
                    ? parseFloat(formData.min_purchase_amount)
                    : null,
                max_discount_amount: formData.max_discount_amount
                    ? parseFloat(formData.max_discount_amount)
                    : null,
                usage_limit: parseInt(formData.usage_limit),
                user_limit: parseInt(formData.user_limit),
                valid_from: new Date(formData.valid_from).toISOString(),
                valid_until: new Date(formData.valid_until).toISOString(),
                applicable_services: formData.applicable_services,
                status: formData.status,
            };

            if (isCreateMode) {
                await createCoupon(submitData);
            } else if (isEditMode) {
                await updateCoupon(decodedId, submitData);
            }

            navigate('/dashboard/coupons');
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    // ==================== LOADING STATE ====================
    if (fetchLoading && (isEditMode || isViewMode)) {
        return (
            <Container maxWidth="lg" sx={{ pt: 14, pb: 4 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="60vh"
                    gap={2}
                >
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                        Loading coupon data...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // ==================== ERROR STATE ====================
    if (fetchError && (isEditMode || isViewMode)) {
        return (
            <Container maxWidth="lg" sx={{ pt: 14, pb: 4 }}>
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate('/dashboard/coupons')}
                            sx={{ fontWeight: 600 }}
                        >
                            Back to Coupons
                        </Button>
                    }
                >
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                        Error Loading Coupon
                    </Typography>
                    <Typography variant="body2">{fetchError}</Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ pt: 14, pb: 4 }}>
            {/* Header */}
            <Fade in timeout={600}>
                <Box mb={4}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/dashboard/coupons')}
                        sx={{ mb: 2, fontWeight: 600 }}
                    >
                        Back to Coupons
                    </Button>

                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
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
                            {isCreateMode && 'Create New Coupon'}
                            {isEditMode && 'Edit Coupon'}
                            {isViewMode && 'View Coupon Details'}
                        </Typography>

                        {isViewMode && <ViewOnlyBadge icon={<VisibilityIcon />} label="View Only" />}
                    </Box>

                    {(isEditMode || isViewMode) && couponData && (
                        <Box mt={1}>
                            <Typography variant="body2" color="text.secondary">
                                Coupon Code: <strong>{couponData.code}</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Fade>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Fade in timeout={600} style={{ transitionDelay: '100ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader>
                                        <TagIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>
                                            Coupon Information
                                        </Typography>
                                    </SectionHeader>

                                    <Stack spacing={3}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.status}
                                                    onChange={handleChange}
                                                    name="status"
                                                    color="primary"
                                                    disabled={isViewMode}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography fontWeight={600}>
                                                        Status: {formData.status ? 'Active' : 'Inactive'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formData.status
                                                            ? 'Coupon is currently active'
                                                            : 'Coupon is disabled'}
                                                    </Typography>
                                                </Box>
                                            }
                                        />

                                        {isViewMode && couponData && (
                                            <>
                                                <Divider />
                                                <Box>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        fontWeight={600}
                                                        textTransform="uppercase"
                                                    >
                                                        Usage Statistics
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {couponData.used_count || 0} / {formData.usage_limit} used
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </StyledCard>
                        </Fade>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Fade in timeout={600} style={{ transitionDelay: '150ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader>
                                        <PercentIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>
                                            Discount Configuration
                                        </Typography>
                                    </SectionHeader>

                                    <Stack spacing={3}>
                                        <FormControl component="fieldset" disabled={isViewMode}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                gutterBottom
                                                color="text.secondary"
                                            >
                                                Discount Type *
                                            </Typography>
                                            <RadioGroup
                                                name="discount_type"
                                                value={formData.discount_type}
                                                onChange={handleChange}
                                                row
                                            >
                                                <FormControlLabel
                                                    value="percentage"
                                                    control={<Radio />}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <PercentIcon fontSize="small" />
                                                            Percentage
                                                        </Box>
                                                    }
                                                />
                                                <FormControlLabel
                                                    value="fixed"
                                                    control={<Radio />}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <AttachMoneyIcon fontSize="small" />
                                                            Fixed Amount
                                                        </Box>
                                                    }
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            label="Discount Value"
                                            name="discount_value"
                                            type="number"
                                            value={formData.discount_value}
                                            onChange={handleChange}
                                            error={!!errors.discount_value}
                                            helperText={
                                                errors.discount_value ||
                                                (formData.discount_type === 'percentage'
                                                    ? 'Enter percentage (0-100)'
                                                    : 'Enter amount in dollars')
                                            }
                                            required
                                            disabled={isViewMode}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        {formData.discount_type === 'percentage' ? (
                                                            <PercentIcon />
                                                        ) : (
                                                            <AttachMoneyIcon />
                                                        )}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                min: 0,
                                                max: formData.discount_type === 'percentage' ? 100 : undefined,
                                                step: formData.discount_type === 'percentage' ? 1 : 0.01,
                                            }}
                                        />

                                        {formData.discount_type === 'percentage' && (
                                            <TextField
                                                fullWidth
                                                label="Max Discount Amount (Optional)"
                                                name="max_discount_amount"
                                                type="number"
                                                value={formData.max_discount_amount}
                                                onChange={handleChange}
                                                error={!!errors.max_discount_amount}
                                                helperText={
                                                    errors.max_discount_amount ||
                                                    'Cap the maximum discount amount'
                                                }
                                                disabled={isViewMode}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AttachMoneyIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{ min: 0, step: 0.01 }}
                                            />
                                        )}

                                        <TextField
                                            fullWidth
                                            label="Minimum Purchase Amount (Optional)"
                                            name="min_purchase_amount"
                                            type="number"
                                            value={formData.min_purchase_amount}
                                            onChange={handleChange}
                                            error={!!errors.min_purchase_amount}
                                            helperText={
                                                errors.min_purchase_amount ||
                                                'Minimum order value required'
                                            }
                                            disabled={isViewMode}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AttachMoneyIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </Stack>
                                </CardContent>
                            </StyledCard>
                        </Fade>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Fade in timeout={600} style={{ transitionDelay: '200ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader>
                                        <PeopleIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>
                                            Usage Limits
                                        </Typography>
                                    </SectionHeader>

                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Total Usage Limit"
                                            name="usage_limit"
                                            type="number"
                                            value={formData.usage_limit}
                                            onChange={handleChange}
                                            error={!!errors.usage_limit}
                                            helperText={
                                                errors.usage_limit ||
                                                'Maximum total redemptions allowed'
                                            }
                                            required
                                            disabled={isViewMode}
                                            inputProps={{ min: 1 }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Per User Limit"
                                            name="user_limit"
                                            type="number"
                                            value={formData.user_limit}
                                            onChange={handleChange}
                                            error={!!errors.user_limit}
                                            helperText={
                                                errors.user_limit || 'Max uses per individual user'
                                            }
                                            required
                                            disabled={isViewMode}
                                            inputProps={{ min: 1 }}
                                        />
                                    </Stack>
                                </CardContent>
                            </StyledCard>
                        </Fade>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Fade in timeout={600} style={{ transitionDelay: '250ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader>
                                        <CalendarTodayIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>
                                            Validity Period
                                        </Typography>
                                    </SectionHeader>

                                    <Stack spacing={3}>
                                        {isViewMode ? (
                                            <>
                                                <Box>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        fontWeight={600}
                                                        textTransform="uppercase"
                                                    >
                                                        Start Date
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {formatDisplayDate(couponData?.valid_from)}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        fontWeight={600}
                                                        textTransform="uppercase"
                                                    >
                                                        End Date
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {formatDisplayDate(couponData?.valid_until)}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    label="Start Date & Time"
                                                    name="valid_from"
                                                    type="datetime-local"
                                                    value={formData.valid_from}
                                                    onChange={handleChange}
                                                    error={!!errors.valid_from}
                                                    helperText={
                                                        errors.valid_from || 'When coupon becomes active'
                                                    }
                                                    required
                                                    InputLabelProps={{ shrink: true }}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="End Date & Time"
                                                    name="valid_until"
                                                    type="datetime-local"
                                                    value={formData.valid_until}
                                                    onChange={handleChange}
                                                    error={!!errors.valid_until}
                                                    helperText={errors.valid_until || 'When coupon expires'}
                                                    required
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </StyledCard>
                        </Fade>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
                            <StyledCard>
                                <CardContent sx={{ p: 3 }}>
                                    <SectionHeader>
                                        <ShoppingBagIcon color="primary" />
                                        <Typography variant="h6" fontWeight={700}>
                                            Applicable Services
                                        </Typography>
                                    </SectionHeader>

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                            fontWeight={600}
                                        >
                                            {isViewMode ? 'Selected Services' : 'Select Services *'}
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={2}>
                                            {serviceOptions.map((service) => {
                                                const isSelected = formData.applicable_services.includes(
                                                    service.value
                                                );
                                                return (
                                                    <ServiceChip
                                                        key={service.value}
                                                        label={service.label}
                                                        icon={<ShoppingBagIcon />}
                                                        selected={isSelected}
                                                        onClick={() => !isViewMode && toggleService(service.value)}
                                                        onDelete={
                                                            !isViewMode && isSelected
                                                                ? () => toggleService(service.value)
                                                                : undefined
                                                        }
                                                        deleteIcon={<CloseIcon />}
                                                        variant={isSelected ? 'filled' : 'outlined'}
                                                        clickable={!isViewMode}
                                                        disabled={isViewMode}
                                                    />
                                                );
                                            })}
                                        </Stack>

                                        {errors.applicable_services && (
                                            <FormHelperText error sx={{ mt: 1, ml: 2 }}>
                                                {errors.applicable_services}
                                            </FormHelperText>
                                        )}

                                        {formData.applicable_services.length > 0 && (
                                            <Paper
                                                sx={{
                                                    mt: 3,
                                                    p: 2,
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={700}
                                                    color="text.secondary"
                                                    gutterBottom
                                                    display="block"
                                                    textTransform="uppercase"
                                                >
                                                    {formData.applicable_services.length} Service
                                                    {formData.applicable_services.length > 1 ? 's' : ''}{' '}
                                                    Selected
                                                </Typography>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {formData.applicable_services.map((service) => (
                                                        <Chip
                                                            key={service}
                                                            label={
                                                                serviceOptions.find((s) => s.value === service)
                                                                    ?.label || service
                                                            }
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    ))}
                                                </Stack>
                                            </Paper>
                                        )}
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Fade>
                    </Grid>
                </Grid>
                <Fade in timeout={600} style={{ transitionDelay: '350ms' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 3,
                            p: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard/coupons')}
                            size="large"
                            sx={{ fontWeight: 600 }}
                        >
                            {isViewMode ? 'Back to List' : 'Cancel'}
                        </Button>

                        <Box display="flex" gap={2}>
                            {isViewMode && (
                                <GradientButton
                                    startIcon={<EditIcon />}
                                    onClick={() =>
                                        navigate(`/dashboard/coupons/edit/${encodeId(decodedId)}`)
                                    }

                                    size="large"
                                >
                                    Edit Coupon
                                </GradientButton>
                            )}

                            {!isViewMode && (
                                <GradientButton
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={createLoading || updateLoading}
                                    size="large"
                                >
                                    {createLoading || updateLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : isCreateMode ? (
                                        'Create Coupon'
                                    ) : (
                                        'Update Coupon'
                                    )}
                                </GradientButton>
                            )}
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </Container>
    );
};

export default CouponForm;