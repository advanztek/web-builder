import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Star } from '@mui/icons-material';
import { useCreateCreditPackage, useDeleteCreditPackage, useGetPackages } from '../../../Hooks/credits';

export const CreditPackagesPanel = () => {
  const { getPackages, packages, loading } = useGetPackages();
  const { createPackage, loading: creating } = useCreateCreditPackage();
  const { deletePackage } = useDeleteCreditPackage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    price: '',
    description: '',
    isPopular: false,
  });

  useEffect(() => {
    getPackages();
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      credits: '',
      price: '',
      description: '',
      isPopular: false,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.credits || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    const packageData = {
      name: formData.name,
      credits: parseInt(formData.credits),
      price: parseFloat(formData.price),
      description: formData.description,
      isPopular: formData.isPopular,
    };

    const result = await createPackage(packageData);
    if (result) {
      handleCloseDialog();
      getPackages();
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      const result = await deletePackage(packageId);
      if (result) {
        getPackages();
      }
    }
  };

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          Credit Packages
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
          sx={{
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
          }}
        >
          Create Package
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {packages?.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  bgcolor: '#1a1f2e',
                  p: 4,
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: '#64748b' }}>
                  No credit packages found. Create your first package!
                </Typography>
              </Box>
            </Grid>
          ) : (
            packages?.map((pkg) => (
              <Grid item xs={12} md={6} key={pkg.id}>
                <Card
                  sx={{
                    bgcolor: '#1a1f2e',
                    border: pkg.isPopular ? '2px solid #3b82f6' : '1px solid #2d3748',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                    },
                  }}
                >
                  {pkg.isPopular && (
                    <Chip
                      icon={<Star sx={{ fontSize: 16 }} />}
                      label="Popular"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: '#3b82f6',
                        color: '#fff',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                      {pkg.name}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: 14, mb: 2 }}>
                      {pkg.description || 'No description'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                      <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                        ${pkg.price}
                      </Typography>
                      <Typography sx={{ color: '#64748b' }}>
                        / {pkg.credits} credits
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#3b82f6' }}
                        onClick={() => {
                          // Edit functionality
                          console.log('Edit package:', pkg.id);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#ef4444' }}
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Create Package Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#141924',
            border: '1px solid #2d3748',
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid #2d3748' }}>
          Create Credit Package
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Package Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1a1f2e',
                color: '#fff',
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
            }}
          />
          <TextField
            fullWidth
            type="number"
            label="Credits"
            value={formData.credits}
            onChange={(e) => handleInputChange('credits', e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1a1f2e',
                color: '#fff',
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
            }}
          />
          <TextField
            fullWidth
            type="number"
            label="Price ($)"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1a1f2e',
                color: '#fff',
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1a1f2e',
                color: '#fff',
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
            }}
          />
          <Button
            variant={formData.isPopular ? 'contained' : 'outlined'}
            startIcon={<Star />}
            onClick={() => handleInputChange('isPopular', !formData.isPopular)}
            sx={{
              color: formData.isPopular ? '#fff' : '#3b82f6',
              bgcolor: formData.isPopular ? '#3b82f6' : 'transparent',
              borderColor: '#3b82f6',
            }}
          >
            Mark as Popular
          </Button>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #2d3748', p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={creating}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
          >
            {creating ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};