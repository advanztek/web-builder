import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ColorPicker from '../ColorPicker';

const ManualProjectDialog = ({
    open,
    onClose,
    formData,
    onChange,
    onSubmit,
    loading,
    error,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Project Name"
                            variant="outlined"
                            placeholder="e.g., My Awesome Landing Page"
                            value={formData.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !loading && formData.name.trim()) {
                                    onSubmit();
                                }
                            }}
                            disabled={loading}
                            required
                            error={!formData.name.trim() && error !== ''}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Description (Optional)"
                            variant="outlined"
                            placeholder="Brief description of your project"
                            value={formData.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            disabled={loading}
                            multiline
                            rows={2}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                            Theme Colors
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ColorPicker
                            label="Primary Color"
                            value={formData.primaryColor}
                            onChange={(e) => onChange('primaryColor', e.target.value)}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ColorPicker
                            label="Secondary Color"
                            value={formData.secondaryColor}
                            onChange={(e) => onChange('secondaryColor', e.target.value)}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <ColorPicker
                            label="Background Color"
                            value={formData.backgroundColor}
                            onChange={(e) => onChange('backgroundColor', e.target.value)}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                            <InputLabel>Font Family</InputLabel>
                            <Select
                                value={formData.font}
                                onChange={(e) => onChange('font', e.target.value)}
                                disabled={loading}
                                label="Font Family"
                            >
                                <MenuItem value="Inter">Inter</MenuItem>
                                <MenuItem value="Roboto">Roboto</MenuItem>
                                <MenuItem value="Open Sans">Open Sans</MenuItem>
                                <MenuItem value="Lato">Lato</MenuItem>
                                <MenuItem value="Montserrat">Montserrat</MenuItem>
                                <MenuItem value="Poppins">Poppins</MenuItem>
                                <MenuItem value="Arial">Arial</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={!formData.name.trim() || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
                >
                    {loading ? 'Creating...' : 'Create & Open'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManualProjectDialog;