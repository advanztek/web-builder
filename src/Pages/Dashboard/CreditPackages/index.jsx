import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Paper,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Inventory as InventoryIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useLoader } from '../../../Context/LoaderContext';
import { apiCall } from '../../../Utils/ApiCall';
import { showToast } from '../../../Utils/toast';
import { encodeId } from '../../../Utils/IdUtils';
import { useDeleteCreditPackage } from '../../../Hooks/credits';

const CreditPackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, package: null });
    const { showLoader, hideLoader } = useLoader();
    const { deletePackage, loading: deleting } = useDeleteCreditPackage();
    const navigate = useNavigate();

    const fetchPackages = async () => {
        setLoading(true);
        showLoader('Loading packages...', 'dots');

        try {
            const res = await apiCall("/V1/admin/packages", null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch packages");
            }

            let packagesData = [];

            if (res.result?.data && Array.isArray(res.result.data)) {
                packagesData = res.result.data;
            } else if (Array.isArray(res.result)) {
                packagesData = res.result;
            } else if (res.result && typeof res.result === 'object') {
                packagesData = [res.result];
            } else if (Array.isArray(res.data)) {
                packagesData = res.data;
            }

            setPackages(packagesData);
            hideLoader();

        } catch (err) {
            console.error("GET PACKAGES ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load packages');
            }

            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.package) return;

        const result = await deletePackage(deleteModal.package.id);
        
        if (result) {
            setPackages(packages.filter(pkg => pkg.id !== deleteModal.package.id));
            setDeleteModal({ show: false, package: null });
        }
    };

    const formatPrice = (price, currency) => {
        const amount = parseFloat(price);
        if (isNaN(amount)) return price;
        
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Credit Packages
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your subscription packages
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/dashboard/credit-packages/create')}
                        size="large"
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Create Package
                    </Button>
                </Box>
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3].map((n) => (
                            <Grid size={{ xs:12, md:6, lg:4 }} key={n}>
                                <Card>
                                    <CardContent>
                                        <Skeleton variant="text" width="60%" height={32} />
                                        <Skeleton variant="text" width="40%" height={40} sx={{ my: 2 }} />
                                        <Skeleton variant="text" width="100%" />
                                        <Skeleton variant="text" width="80%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : packages.length === 0 ? (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 8, 
                            textAlign: 'center',
                            bgcolor: 'white',
                            borderRadius: 2
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}
                        >
                            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            No Packages Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Create your first credit package to get started
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/dashboard/credit-packages/create')}
                            sx={{ mt: 2 }}
                        >
                            Create First Package
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {packages.map((pkg) => (
                            <Grid size={{ xs:12, md:6, lg:4}} key={pkg.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    {pkg.name}
                                                </Typography>
                                                <Chip
                                                    label={pkg.status ? 'Active' : 'Inactive'}
                                                    color={pkg.status ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>

                                        {/* Price */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h4" fontWeight="bold" color="primary">
                                                {formatPrice(pkg.price, pkg.currency)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {pkg.credit_amount} Credits
                                            </Typography>
                                        </Box>

                                        {/* Description */}
                                        {pkg.description && (
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {pkg.description}
                                            </Typography>
                                        )}

                                        {/* Features */}
                                        {pkg.features && pkg.features.length > 0 && (
                                            <List dense sx={{ mb: 1 }}>
                                                {pkg.features.slice(0, 3).map((feature, idx) => (
                                                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                            <CheckCircleIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={feature}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                                {pkg.features.length > 3 && (
                                                    <Typography variant="caption" color="primary" sx={{ pl: 0 }}>
                                                        +{pkg.features.length - 3} more features
                                                    </Typography>
                                                )}
                                            </List>
                                        )}

                                        {/* Date */}
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                                            Created: {formatDate(pkg.created_at)}
                                        </Typography>
                                    </CardContent>

                                    <Divider />

                                    <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
                                        <Button
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => navigate(`/dashboard/credit-packages/view/${encodeId(pkg.id)}`)}
                                        >
                                            View
                                        </Button>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => navigate(`/dashboard/credit-packages/edit/${encodeId(pkg.id)}`)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setDeleteModal({ show: true, package: pkg })}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Dialog
                open={deleteModal.show}
                onClose={() => !deleting && setDeleteModal({ show: false, package: null })}
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
                        Are you sure you want to delete <strong>"{deleteModal.package?.name}"</strong>? 
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={() => setDeleteModal({ show: false, package: null })}
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

export default CreditPackagesPage;