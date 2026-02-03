import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
    IconButton,
    MenuItem,
    Switch,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useUpdateCreditPackage } from '../../../../Hooks/credits';
import { showToast } from '../../../../Utils/toast';
import { useLoader } from '../../../../Context/LoaderContext';
import { apiCall } from '../../../../Utils/ApiCall';
import { safeDecodeId } from '../../../../Utils/IdUtils';

export const EditPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updatePackage, loading: updating } = useUpdateCreditPackage();
    const { showLoader, hideLoader } = useLoader();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        currency: 'NGN',
        credit_amount: '',
        description: '',
        status: true,
        features: []
    });

    const [featureInput, setFeatureInput] = useState('');
    const [errors, setErrors] = useState({});

    const currencies = ['NGN', 'USD', 'EUR', 'GHC'];

    useEffect(() => {
        const fetchPackage = async () => {
            const decodedId = safeDecodeId(id);
            setLoading(true);
            showLoader('Loading package...', 'dots');

            try {
                const res = await apiCall(`/V1/admin/package/${decodedId}`, null, 'GET');

                if (!res?.success) {
                    throw new Error(res?.message || "Failed to fetch package");
                }

                const pkg = res.result;

                setFormData({
                    name: pkg.name || '',
                    price: pkg.price || '',
                    currency: pkg.currency || 'NGN',
                    credit_amount: pkg.credit_amount || '',
                    description: pkg.description || '',
                    status: pkg.status !== undefined ? pkg.status : true,
                    features: Array.isArray(pkg.features) ? pkg.features : []
                });

                hideLoader();

            } catch (err) {
                console.error("GET PACKAGE ERROR:", err);
                hideLoader();

                if (err.message?.includes('Unauthorized')) {
                    showToast.error('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    showToast.error(err.message || 'Failed to load package');
                    navigate('/dashboard/credit-packages');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPackage();
        }
    }, [id]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Package name is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.credit_amount || parseInt(formData.credit_amount) <= 0) {
            newErrors.credit_amount = 'Credit amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast.error('Please fix the errors in the form');
            return;
        }

        const decodedId = safeDecodeId(id);
        const result = await updatePackage(decodedId, formData);

        if (result) {
            navigate('/dashboard/credit-packages');
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        Loading package...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/dashboard/credit-packages')}
                        sx={{ mb: 2 }}
                    >
                        Back to Packages
                    </Button>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Edit Package
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Update package details and configuration
                    </Typography>
                </Box>

                {/* Form */}
                <Card component="form" onSubmit={handleSubmit}>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            {/* Package Name */}
                            <Grid size={{ xs:12 }}>
                                <TextField
                                    fullWidth
                                    label="Package Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    required
                                    placeholder="e.g., Starter Pack, Premium Bundle"
                                />
                            </Grid>

                            {/* Price and Currency */}
                            <Grid size={{ xs:12, sm:8 }}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    error={!!errors.price}
                                    helperText={errors.price}
                                    required
                                    inputProps={{ step: '0.01', min: '0' }}
                                    placeholder="0.00"
                                />
                            </Grid>

                            <Grid size={{ xs:12, sm:4}}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                >
                                    {currencies.map((curr) => (
                                        <MenuItem key={curr} value={curr}>
                                            {curr}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Credit Amount */}
                            <Grid size={{ xs:12 }}>
                                <TextField
                                    fullWidth
                                    label="Credit Amount"
                                    name="credit_amount"
                                    type="number"
                                    value={formData.credit_amount}
                                    onChange={handleInputChange}
                                    error={!!errors.credit_amount}
                                    helperText={errors.credit_amount}
                                    required
                                    inputProps={{ min: '0' }}
                                    placeholder="Number of credits included"
                                />
                            </Grid>

                            {/* Description */}
                            <Grid size={{ xs:12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe what makes this package special..."
                                />
                            </Grid>

                            {/* Features */}
                            <Grid size={{ xs:12 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Features
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddFeature();
                                            }
                                        }}
                                        placeholder="Add a feature (press Enter)"
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddFeature}
                                        startIcon={<AddIcon />}
                                    >
                                        Add
                                    </Button>
                                </Box>

                                {formData.features.length > 0 && (
                                    <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        <List dense>
                                            {formData.features.map((feature, index) => (
                                                <ListItem key={index}>
                                                    <CheckCircleIcon
                                                        color="success"
                                                        sx={{ mr: 1.5, fontSize: 20 }}
                                                    />
                                                    <ListItemText primary={feature} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={() => handleRemoveFeature(index)}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                )}
                            </Grid>

                            {/* Status */}
                            <Grid size={{ xs:12 }}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Package Status
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formData.status
                                                    ? 'Package is active and visible to users'
                                                    : 'Package is inactive and hidden from users'}
                                            </Typography>
                                        </Box>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.status}
                                                    onChange={handleInputChange}
                                                    name="status"
                                                    color="primary"
                                                />
                                            }
                                            label=""
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>

                    <Box sx={{ px: 4, pb: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard/credit-packages')}
                            disabled={updating}
                            size="large"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updating}
                            startIcon={updating ? null : <SaveIcon />}
                            size="large"
                        >
                            {updating ? 'Updating...' : 'Update Package'}
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};