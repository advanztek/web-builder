import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    AccountBalanceWallet as WalletIcon,
    MonetizationOn as MoneyIcon
} from '@mui/icons-material';
import { showToast } from '../../../../Utils/toast';
import { useLoader } from '../../../../Context/LoaderContext';
import { apiCall } from '../../../../Utils/ApiCall';
import { safeDecodeId, encodeId } from '../../../../Utils/IdUtils';
import { useDeleteCreditPackage } from '../../../../Hooks/credits';


export const ViewPackage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { deletePackage, loading: deleting } = useDeleteCreditPackage();

    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);

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

                setPackageData(res.result);
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

    const handleDelete = async () => {
        if (!packageData) return;

        const result = await deletePackage(packageData.id);

        if (result) {
            navigate('/dashboard/credit-packages');
        }
    };

    const formatPrice = (price, currency) => {
        const amount = parseFloat(price);
        if (isNaN(amount)) return price;

        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (!packageData) {
        return null;
    }

    const pricePerCredit = parseFloat(packageData.price) / parseInt(packageData.credit_amount);

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/dashboard/credit-packages')}
                        sx={{ mb: 2 }}
                    >
                        Back to Packages
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Package Details
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                View complete package information
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/dashboard/credit-packages/edit/${encodeId(packageData.id)}`)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setDeleteModal(true)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Content */}
                <Grid container spacing={3}>
                    {/* Main Info */}
                    <Grid size={{ xs:12, lg:8 }}>
                        {/* Header Card */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {packageData.name}
                                        </Typography>
                                        <Chip
                                            label={packageData.status ? 'Active' : 'Inactive'}
                                            color={packageData.status ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </Box>
                                    <Paper elevation={0} sx={{ bgcolor: 'grey.100', px: 2, py: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Package ID
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                            #{packageData.id}
                                        </Typography>
                                    </Paper>
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <MoneyIcon sx={{ mr: 1 }} />
                                                <Typography variant="caption">
                                                    Price
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" fontWeight="bold">
                                                {formatPrice(packageData.price, packageData.currency)}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <WalletIcon sx={{ mr: 1 }} />
                                                <Typography variant="caption">
                                                    Credits
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" fontWeight="bold">
                                                {packageData.credit_amount}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {packageData.description && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Description
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {packageData.description}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Features Card */}
                        {packageData.features && packageData.features.length > 0 && (
                            <Card>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Features
                                    </Typography>
                                    <List>
                                        {packageData.features.map((feature, index) => (
                                            <ListItem key={index} sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>
                                                    <CheckCircleIcon color="success" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={feature}
                                                    primaryTypographyProps={{ variant: 'body2' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs:12, lg:4 }}>
                        {/* Details Card */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Package Information
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                        Currency
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label={packageData.currency} size="small" color="primary" />
                                        <Typography variant="body2" fontWeight="medium">
                                            {packageData.currency}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                        Created At
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(packageData.created_at)}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(packageData.updated_at)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Quick Stats
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: 'primary.light' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2">Price per Credit</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {formatPrice(pricePerCredit, packageData.currency)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2">Total Features</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {packageData.features?.length || 0}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Status</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {packageData.status ? '✓ Active' : '✗ Inactive'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <Dialog
                open={deleteModal}
                onClose={() => !deleting && setDeleteModal(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color="error" />
                        Delete Package
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>"{packageData.name}"</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setDeleteModal(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};