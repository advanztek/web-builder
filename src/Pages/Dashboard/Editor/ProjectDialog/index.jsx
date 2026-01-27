import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
} from '@mui/material';
import { AutoAwesome, EditNote } from '@mui/icons-material';

const ProjectChoiceDialog = ({ open, onClose, onAI, onManual }) => {
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                Choose Creation Method
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                border: `2px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                            onClick={onAI}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <AutoAwesome
                                    sx={{
                                        fontSize: 64,
                                        color: theme.palette.primary.main,
                                        mb: 2
                                    }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    AI Prompts
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Let AI help you build your project with intelligent prompts
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                border: `2px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: theme.palette.secondary.main,
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                            onClick={onManual}
                        >
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <EditNote sx={{ fontSize: 64, color: theme.palette.secondary.main, mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Manual Setup
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Configure your project settings manually
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectChoiceDialog;