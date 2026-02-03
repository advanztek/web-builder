import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Alert
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useCreateCreditPackage } from '../../../../Hooks/credits';
import { showToast } from '../../../../Utils/toast';

export const CreatePackage = () => {
    const navigate = useNavigate();
    const { createPackage, loading } = useCreateCreditPackage();

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

        const result = await createPackage(formData);

        if (result) {
            navigate('/dashboard/credit-packages');
        }
    };

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
                        Create New Package
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Add a new credit package to your catalog
                    </Typography>
                </Box>

                <Card component="form" onSubmit={handleSubmit}>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
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

                    {/* Action Buttons */}
                    <Box sx={{ px: 4, pb: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard/credit-packages')}
                            disabled={loading}
                            size="large"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? null : <SaveIcon />}
                            size="large"
                        >
                            {loading ? 'Creating...' : 'Create Package'}
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};