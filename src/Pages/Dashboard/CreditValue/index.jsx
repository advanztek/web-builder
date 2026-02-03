import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Grid,
    Divider,
    CircularProgress,
    InputAdornment,
    Alert,
} from '@mui/material';
import {
    AttachMoney,
    Save,
    Refresh,
    TrendingUp,
} from '@mui/icons-material';
import { useGetCreditValue, useAssignCreditValue } from '../../../Hooks/admin_credits';

const CreditValueManagement = () => {
    const [newValue, setNewValue] = useState('');
    const [error, setError] = useState('');

    const { getCreditValue, creditValue, loading: loadingGet } = useGetCreditValue();
    const { assignCreditValue, loading: loadingAssign } = useAssignCreditValue();

    // Load credit value on mount
    useEffect(() => {
        getCreditValue();
    }, []);

    // Update input field when credit value is loaded
    useEffect(() => {
        if (creditValue?.value) {
            setNewValue(creditValue.value);
        }
    }, [creditValue]);

    // Validate input
    const validateInput = (value) => {
        if (!value || value.trim() === '') {
            setError('Credit value is required');
            return false;
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            setError('Please enter a valid number');
            return false;
        }

        if (numValue < 0) {
            setError('Credit value cannot be negative');
            return false;
        }

        setError('');
        return true;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewValue(value);
        
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInput(newValue)) {
            return;
        }

        const result = await assignCreditValue(newValue);
        
        if (result) {
            // Refresh the credit value after successful update
            await getCreditValue();
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        getCreditValue();
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                    Credit Value Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Set and manage the default credit value for the system
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs:12, md:4 }}>
                    <Card 
                        elevation={3}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ fontSize: 40, mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Current Value
                                </Typography>
                            </Box>
                            
                            {loadingGet ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress sx={{ color: 'white' }} />
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="h2" sx={{ fontWeight: 700, my: 2 }}>
                                        {creditValue?.value ? `$${parseFloat(creditValue.value).toLocaleString()}` : '$0.00'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Per credit unit
                                    </Typography>
                                </>
                            )}
                            
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleRefresh}
                                disabled={loadingGet}
                                sx={{
                                    mt: 3,
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                                fullWidth
                            >
                                Refresh
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs:12, md:8 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Update Credit Value
                        </Typography>
                        
                        <Divider sx={{ mb: 3 }} />

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Credit Value"
                                value={newValue}
                                onChange={handleInputChange}
                                placeholder="Enter credit value"
                                type="number"
                                inputProps={{
                                    step: "0.01",
                                    min: "0",
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoney />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!error}
                                disabled={loadingAssign}
                                sx={{ mb: 3 }}
                            />

                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> This value will be used as the default credit value throughout the system.
                                    Make sure to verify before updating.
                                </Typography>
                            </Alert>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={loadingAssign ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                    disabled={loadingAssign || !newValue || !!error}
                                    sx={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        },
                                    }}
                                >
                                    {loadingAssign ? 'Updating...' : 'Update Value'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleRefresh}
                                    disabled={loadingGet || loadingAssign}
                                    sx={{ minWidth: 120 }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                                How It Works:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                • The credit value determines how much each credit unit is worth in your system
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                • This value is used for calculations across the platform
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Changes will take effect immediately after updating
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs:12}} >
                    <Card elevation={2} sx={{ bgcolor: '#fff3e0' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#e65100' }}>
                                ⚠️ Important Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Changing the credit value will affect all future transactions and calculations. 
                                Please ensure you understand the impact before making changes. It's recommended to 
                                notify all administrators before updating this value.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreditValueManagement;