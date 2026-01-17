
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    useTheme,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Snackbar,
    CircularProgress,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem as SelectMenuItem,
} from '@mui/material';
import {
    Add,
    Publish,
    Folder,
    Star,
    ChevronLeft,
    ChevronRight,
    MoreVert,
    Edit,
    Delete,
    ContentCopy,
    OpenInNew,
    Refresh,
    AutoAwesome,
    EditNote,
} from '@mui/icons-material';
import { FONT_FAMILY } from '../../Config/font';
import {
    setActiveProject,
    deleteProject as deleteProjectRedux,
    duplicateProject,
    updateProjectName,
} from '../../Store/slices/projectsSlice';
import {
    useCreateProject,
    useGetProjects,
    useDeleteProject
} from '../../Hooks/projects';

// Dashboard Slider Component
const DashboardSlider = () => {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: 'Create Amazing Designs',
            description: 'Build stunning projects with our intuitive design tools',
            bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            title: 'Collaborate with Your Team',
            description: 'Work together in real-time on your projects',
            bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            title: 'Publish with Confidence',
            description: 'Share your work with the world instantly',
            bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
    ];

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: 200,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4,
            }}
        >
            {slides.map((slide, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: slide.bgColor,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: currentSlide === index ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        px: 4,
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 2,
                            textAlign: 'center',
                        }}
                    >
                        {slide.title}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            textAlign: 'center',
                            maxWidth: 600,
                        }}
                    >
                        {slide.description}
                    </Typography>
                </Box>
            ))}

            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                    },
                }}
            >
                <ChevronLeft />
            </IconButton>
            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                    },
                }}
            >
                <ChevronRight />
            </IconButton>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                }}
            >
                {slides.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: currentSlide === index ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

// Projects Table Component
const ProjectsTable = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const reduxProjects = useSelector(state => state.projects.projects);
    const reduxProjectsList = useMemo(() => Object.values(reduxProjects), [reduxProjects]);

    const { getProjects, projects: apiProjects, loading: loadingProjects } = useGetProjects();
    const { deleteProject: deleteProjectAPI } = useDeleteProject();

    const [hasLoadedAPI, setHasLoadedAPI] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState('');

    const projectsList = useMemo(() => {
        if (apiProjects && apiProjects.length > 0) {
            return apiProjects;
        }
        return reduxProjectsList;
    }, [apiProjects, reduxProjectsList]);

    useEffect(() => {
        if (!hasLoadedAPI) {
            const fetchProjects = async () => {
                try {
                    await getProjects();
                } catch (error) {
                    console.log('API fetch failed, using Redux projects:', error);
                } finally {
                    setHasLoadedAPI(true);
                }
            };
            fetchProjects();
        }
    }, [hasLoadedAPI]);

    const handleRefresh = async () => {
        try {
            await getProjects();
        } catch (error) {
            console.log('Refresh failed:', error);
        }
    };

    const handleMenuOpen = (event, project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenProject = (project) => {
        dispatch(setActiveProject(project.id));

        // Use slug if available, otherwise fall back to id
        const identifier = project.slug || project.data?.slug || project.id;

        // Navigate to editor route with slug
        navigate(`/dashboard/editor/${identifier}`);
        handleMenuClose();
    };

    const handleEditProject = () => {
        setEditName(selectedProject.name);
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleSaveEdit = () => {
        if (editName.trim() && selectedProject) {
            dispatch(updateProjectName({
                projectId: selectedProject.id,
                name: editName
            }));
            setEditDialogOpen(false);
            setSelectedProject(null);
            setEditName('');
        }
    };

    const handleDuplicate = () => {
        dispatch(duplicateProject({ projectId: selectedProject.id }));
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${selectedProject.name}"?`)) {
            try {
                await deleteProjectAPI(selectedProject.id);
            } catch (error) {
                console.log('API delete failed:', error);
            }

            dispatch(deleteProjectRedux(selectedProject.id));

            try {
                await getProjects();
            } catch (error) {
                console.log('Refresh after delete failed:', error);
            }
        }
        handleMenuClose();
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        try {
            const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
            const now = Date.now();
            const diff = now - date.getTime();
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
            if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
            if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getProjectStatus = (project) => {
        if (project.data && typeof project.data.status === 'string') {
            return project.data.status.charAt(0).toUpperCase() + project.data.status.slice(1);
        }

        if (typeof project.status === 'string') {
            return project.status.charAt(0).toUpperCase() + project.status.slice(1);
        }

        if (typeof project.status === 'boolean') {
            return project.status ? 'Active' : 'Inactive';
        }

        if (project.gjsData || project.sections) {
            const updateTime = project.updatedAt || project.updated_at;
            if (!updateTime) return 'New';

            try {
                const timeSinceUpdate = Date.now() - (typeof updateTime === 'string' ? new Date(updateTime).getTime() : updateTime);
                const daysSinceUpdate = timeSinceUpdate / 86400000;

                if (daysSinceUpdate < 1) return 'In Progress';
                if (daysSinceUpdate < 7) return 'Review';
                return 'Completed';
            } catch (error) {
                return 'New';
            }
        }

        return 'New';
    };

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'completed':
            case 'published':
            case 'active':
                return 'success';
            case 'in progress':
            case 'draft':
                return 'primary';
            case 'review':
                return 'warning';
            case 'new':
            case 'inactive':
                return 'default';
            default:
                return 'default';
        }
    };

    if (loadingProjects && projectsList.length === 0 && !hasLoadedAPI) {
        return (
            <Box sx={{ mt: 6, textAlign: 'center', py: 8 }}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Loading projects...
                </Typography>
            </Box>
        );
    }

    if (projectsList.length === 0) {
        return (
            <Box sx={{ mt: 6, textAlign: 'center', py: 8 }}>
                <Folder sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No projects yet. Create your first project to get started!
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    sx={{ mt: 2 }}
                    disabled={loadingProjects}
                >
                    {loadingProjects ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}
                >
                    Recent Projects ({projectsList.length})
                </Typography>
                <Button
                    startIcon={loadingProjects ? <CircularProgress size={16} /> : <Refresh />}
                    onClick={handleRefresh}
                    disabled={loadingProjects}
                    size="small"
                >
                    {loadingProjects ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Last Modified</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectsList
                            .sort((a, b) => {
                                const aTime = a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0;
                                const bTime = b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0;
                                const aDate = typeof aTime === 'string' ? new Date(aTime).getTime() : aTime;
                                const bDate = typeof bTime === 'string' ? new Date(bTime).getTime() : bTime;
                                return bDate - aDate;
                            })
                            .slice(0, 10)
                            .map((project) => {
                                const status = getProjectStatus(project);
                                return (
                                    <TableRow
                                        key={project.id}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: theme.palette.action.hover,
                                                cursor: 'pointer',
                                            },
                                        }}
                                        onClick={() => handleOpenProject(project)}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {project.name}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={status}
                                                color={getStatusColor(status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                                            {formatDate(project.createdAt || project.created_at)}
                                        </TableCell>
                                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                                            {formatDate(project.updatedAt || project.updated_at || project.createdAt || project.created_at)}
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, project)}
                                            >
                                                <MoreVert fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleOpenProject(selectedProject)}>
                    <ListItemIcon>
                        <OpenInNew fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Open</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleEditProject}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDuplicate}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Rename Project</DialogTitle>
                <DialogContent sx={{ width: 400, pt: 2 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Project Name"
                        variant="outlined"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSaveEdit();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        disabled={!editName.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { createProject, loading: creatingProject } = useCreateProject();

    const reduxProjects = useSelector(state => state.projects.projects);
    const projectsList = useMemo(() => Object.values(reduxProjects), [reduxProjects]);

    // Modal states
    const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
    const [manualDialogOpen, setManualDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        primaryColor: '#1976d2',
        secondaryColor: '#0F172A',
        backgroundColor: '#FFFFFF',
        font: 'Inter'
    });
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        setError('');
    };

    const handleCreateProject = () => {
        setChoiceDialogOpen(true);
    };

    const handleChoiceClose = () => {
        setChoiceDialogOpen(false);
    };

    const handleChoiceAI = async () => {
        setChoiceDialogOpen(false);

        // Create project with minimal data and navigate to prompts page
        try {
            const projectData = {
                name: `Project ${projectsList.length + 1}`,
                description: 'AI Generated Project',
                primaryColor: '#1976d2',
                secondaryColor: '#0F172A',
                backgroundColor: '#FFFFFF',
                font: 'Inter',
                mode: 'prompt' // Add mode for API
            };

            const result = await createProject(projectData);

            if (result) {
                const identifier = result.slug || result.data?.slug || result.id;
                navigate(`/dashboard/prompts/${identifier}`);
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setSnackbarMessage(err.message || 'Failed to create project');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleChoiceManual = () => {
        setChoiceDialogOpen(false);
        setManualDialogOpen(true);
    };

    const handleManualDialogClose = () => {
        if (!creatingProject) {
            setManualDialogOpen(false);
            setError('');
            setFormData({
                name: '',
                description: '',
                primaryColor: '#1976d2',
                secondaryColor: '#0F172A',
                backgroundColor: '#FFFFFF',
                font: 'Inter'
            });
        }
    };

    const handleConfirmManualCreate = async () => {
        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        setError('');

        try {
            const projectData = {
                name: formData.name.trim(),
                description: formData.description.trim() || `Project: ${formData.name}`,
                primaryColor: formData.primaryColor,
                secondaryColor: formData.secondaryColor,
                backgroundColor: formData.backgroundColor,
                font: formData.font,
                mode: 'manual' // Add mode for API
            };

            const result = await createProject(projectData);

            if (result) {
                setFormData({
                    name: '',
                    description: '',
                    primaryColor: '#1976d2',
                    secondaryColor: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    font: 'Inter'
                });
                setManualDialogOpen(false);

                setSnackbarMessage('Project created successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                // Navigate to editor with slug
                const identifier = result.slug || result.data?.slug || result.id;
                navigate(`/dashboard/editor/${identifier}`);
            }
        } catch (err) {
            console.error('Error creating project:', err);
            setError(err.message || 'Failed to create project');
            setSnackbarMessage(err.message || 'Failed to create project');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleViewAllProjects = () => {
        const projectsSection = document.getElementById('projects-table');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const cards = [
        {
            title: 'Create New Project',
            icon: <Add sx={{ fontSize: 28 }} />,
            description: 'Start a new design project',
            onClick: handleCreateProject,
            color: theme.palette.primary.main,
        },
        {
            title: 'My Projects',
            icon: <Folder sx={{ fontSize: 28 }} />,
            description: `${projectsList.length} total projects`,
            onClick: handleViewAllProjects,
            color: theme.palette.info.main,
        },
        {
            title: 'Published Projects',
            icon: <Publish sx={{ fontSize: 28 }} />,
            description: 'View your published work',
            onClick: () => console.log('Published Projects clicked'),
            color: theme.palette.success.main,
        },
        {
            title: 'Favorites',
            icon: <Star sx={{ fontSize: 28 }} />,
            description: 'Access your starred projects',
            onClick: () => console.log('Favorites clicked'),
            color: theme.palette.warning.main,
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                pt: 12,
                px: 4,
                pb: 4,
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <DashboardSlider />

                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: FONT_FAMILY.secondary,
                        mb: 1,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                    }}
                >
                    Welcome Back to Dashboard
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 6,
                        color: theme.palette.text.secondary,
                    }}
                >
                    Choose an option below to get started
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            sx={{
                                height: '100%',
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: theme.shadows[8],
                                    borderColor: card.color,
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={card.onClick}
                                sx={{
                                    height: '100%',
                                    p: 1,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: card.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1,
                                            borderRadius: '50%',
                                            bgcolor: theme.palette.action.hover,
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            {card.description}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>

                <div id="projects-table">
                    <ProjectsTable />
                </div>
            </Box>

            {/* Choice Dialog - AI or Manual */}
            <Dialog
                open={choiceDialogOpen}
                onClose={handleChoiceClose}
                maxWidth="sm"
                fullWidth
            >
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
                                        boxShadow: theme.shadows[4],
                                    },
                                }}
                                onClick={handleChoiceAI}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <AutoAwesome
                                        sx={{
                                            fontSize: 64,
                                            color: theme.palette.primary.main,
                                            mb: 2,
                                        }}
                                    />
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
                                        boxShadow: theme.shadows[4],
                                    },
                                }}
                                onClick={handleChoiceManual}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <EditNote
                                        sx={{
                                            fontSize: 64,
                                            color: theme.palette.secondary.main,
                                            mb: 2,
                                        }}
                                    />
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
                    <Button onClick={handleChoiceClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Manual Creation Dialog */}
            <Dialog
                open={manualDialogOpen}
                onClose={handleManualDialogClose}
                maxWidth="md"
                fullWidth
            >
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
                                onChange={handleInputChange('name')}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !creatingProject && formData.name.trim()) {
                                        handleConfirmManualCreate();
                                    }
                                }}
                                disabled={creatingProject}
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
                                onChange={handleInputChange('description')}
                                disabled={creatingProject}
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
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Primary Color
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        type="color"
                                        value={formData.primaryColor}
                                        onChange={handleInputChange('primaryColor')}
                                        disabled={creatingProject}
                                        sx={{ width: 60 }}
                                    />
                                    <TextField
                                        size="small"
                                        value={formData.primaryColor}
                                        onChange={handleInputChange('primaryColor')}
                                        disabled={creatingProject}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Secondary Color
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        type="color"
                                        value={formData.secondaryColor}
                                        onChange={handleInputChange('secondaryColor')}
                                        disabled={creatingProject}
                                        sx={{ width: 60 }}
                                    />
                                    <TextField
                                        size="small"
                                        value={formData.secondaryColor}
                                        onChange={handleInputChange('secondaryColor')}
                                        disabled={creatingProject}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Background Color
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        type="color"
                                        value={formData.backgroundColor}
                                        onChange={handleInputChange('backgroundColor')}
                                        disabled={creatingProject}
                                        sx={{ width: 60 }}
                                    />
                                    <TextField
                                        size="small"
                                        value={formData.backgroundColor}
                                        onChange={handleInputChange('backgroundColor')}
                                        disabled={creatingProject}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>Font Family</InputLabel>
                                <Select
                                    value={formData.font}
                                    onChange={handleInputChange('font')}
                                    disabled={creatingProject}
                                    label="Font Family"
                                >
                                    <SelectMenuItem value="Inter">Inter</SelectMenuItem>
                                    <SelectMenuItem value="Roboto">Roboto</SelectMenuItem>
                                    <SelectMenuItem value="Open Sans">Open Sans</SelectMenuItem>
                                    <SelectMenuItem value="Lato">Lato</SelectMenuItem>
                                    <SelectMenuItem value="Montserrat">Montserrat</SelectMenuItem>
                                    <SelectMenuItem value="Poppins">Poppins</SelectMenuItem>
                                    <SelectMenuItem value="Arial">Arial</SelectMenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleManualDialogClose} disabled={creatingProject}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmManualCreate}
                        variant="contained"
                        disabled={!formData.name.trim() || creatingProject}
                        startIcon={creatingProject ? <CircularProgress size={20} color="inherit" /> : <Add />}
                    >
                        {creatingProject ? 'Creating...' : 'Create & Open'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard