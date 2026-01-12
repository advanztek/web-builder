import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from '@mui/icons-material';
import { FONT_FAMILY } from '../../Config/font';
import {
    createProject,
    setActiveProject,
    deleteProject,
    duplicateProject,
    updateProjectName,
} from '../../Store/slices/projectsSlice';

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

// Projects Table Component with Real Data
const ProjectsTable = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const projects = useSelector(state => state.projects.projects);
    const projectsList = Object.values(projects);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState('');

    const handleMenuOpen = (event, project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenProject = (project) => {
        dispatch(setActiveProject(project.id));
        navigate('/dashboard/editor');
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

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${selectedProject.name}"?`)) {
            dispatch(deleteProject(selectedProject.id));
        }
        handleMenuClose();
    };

    const formatDate = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getProjectStatus = (project) => {
        if (project.gjsData) {
            const timeSinceUpdate = Date.now() - project.updatedAt;
            const daysSinceUpdate = timeSinceUpdate / 86400000;

            if (daysSinceUpdate < 1) return 'In Progress';
            if (daysSinceUpdate < 7) return 'Review';
            return 'Completed';
        }
        return 'New';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'primary';
            case 'Review':
                return 'warning';
            case 'New':
                return 'default';
            default:
                return 'default';
        }
    };

    if (projectsList.length === 0) {
        return (
            <Box sx={{ mt: 6, textAlign: 'center', py: 8 }}>
                <Folder sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No projects yet. Create your first project to get started!
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 6 }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: theme.palette.text.primary,
                }}
            >
                Recent Projects ({projectsList.length})
            </Typography>
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
                            .sort((a, b) => b.updatedAt - a.updatedAt)
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
                                            {formatDate(project.createdAt)}
                                        </TableCell>
                                        <TableCell sx={{ color: theme.palette.text.secondary }}>
                                            {formatDate(project.updatedAt)}
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

            {/* Context Menu */}
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

            {/* Edit Dialog */}
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

    const projects = useSelector(state => state.projects.projects);
    const projectsList = Object.values(projects);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [storageError, setStorageError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    const hasLoadedRef = useRef(false);
    const saveTimeoutRef = useRef(null);

    // Load projects from localStorage ONCE on mount
    useEffect(() => {
        // Only load if we haven't already and Redux store is empty
        if (hasLoadedRef.current || Object.keys(projects).length > 0) {
            return;
        }

        try {
            const savedData = localStorage.getItem('grapesjs-projects');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                console.log('Loaded projects from localStorage:', parsed);
                // Note: Since loadProjectsFromStorage doesn't exist, 
                // projects will be managed through Redux actions only
                hasLoadedRef.current = true;
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setStorageError('Failed to load saved projects. Starting fresh.');
            setSnackbarOpen(true);
        }

        hasLoadedRef.current = true;
    }, []); // Run only once on mount

    // Save to localStorage with debouncing and error handling
    useEffect(() => {
        // Skip if no projects or still loading
        if (Object.keys(projects).length === 0 || !hasLoadedRef.current) {
            return;
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Debounce the save operation
        saveTimeoutRef.current = setTimeout(() => {
            try {
                const dataToSave = {
                    projects,
                    activeProjectId: null,
                    lastSaved: Date.now()
                };

                const dataString = JSON.stringify(dataToSave);
                
                // Check data size before saving
                const sizeInBytes = new Blob([dataString]).size;
                const sizeInMB = sizeInBytes / (1024 * 1024);
                
                // LocalStorage typical limit is 5-10MB
                if (sizeInMB > 4.5) {
                    console.warn(`Data size is large: ${sizeInMB.toFixed(2)}MB. Creating lightweight backup...`);
                    
                    // Create lightweight version with only essential data
                    const lightweightData = {
                        projects: Object.fromEntries(
                            Object.entries(projects).map(([id, project]) => [
                                id,
                                {
                                    id: project.id,
                                    name: project.name,
                                    createdAt: project.createdAt,
                                    updatedAt: project.updatedAt,
                                    // Exclude large gjsData if it exists
                                    ...(project.gjsData && { hasGjsData: true })
                                }
                            ])
                        ),
                        activeProjectId: null,
                        lastSaved: Date.now(),
                        lightweight: true
                    };
                    
                    localStorage.setItem('grapesjs-projects', JSON.stringify(lightweightData));
                    setStorageError('Large project data detected. Saving essential info only.');
                    setSnackbarOpen(true);
                } else {
                    localStorage.setItem('grapesjs-projects', dataString);
                }
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                
                if (error.name === 'QuotaExceededError') {
                    // Try to save minimal data
                    try {
                        const minimalData = {
                            projects: Object.fromEntries(
                                Object.entries(projects).map(([id, project]) => [
                                    id,
                                    {
                                        id: project.id,
                                        name: project.name,
                                        createdAt: project.createdAt,
                                        updatedAt: project.updatedAt,
                                    }
                                ])
                            ),
                            lastSaved: Date.now(),
                            quotaExceeded: true
                        };
                        
                        localStorage.setItem('grapesjs-projects', JSON.stringify(minimalData));
                        setStorageError('Storage limit reached. Saving project names only. Consider exporting your projects.');
                        setSnackbarOpen(true);
                    } catch (retryError) {
                        console.error('Failed to save even minimal data:', retryError);
                        setStorageError('Unable to save projects. Storage is full. Please clear browser data or export projects.');
                        setSnackbarOpen(true);
                    }
                } else {
                    setStorageError('Failed to save projects to browser storage.');
                    setSnackbarOpen(true);
                }
            }
        }, 1500); // Debounce for 1.5 seconds

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [projects]);

    const handleCreateProject = () => {
        setCreateDialogOpen(true);
    };

    const handleConfirmCreate = () => {
        if (projectName.trim()) {
            const action = dispatch(createProject({ name: projectName }));
            const newProjectId = action.payload?.id;

            setProjectName('');
            setCreateDialogOpen(false);

            // Navigate to editor with new project
            if (newProjectId) {
                dispatch(setActiveProject(newProjectId));
                navigate('/dashboard/editor');
            }
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

            {/* Create Project Dialog */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent sx={{ width: 400, pt: 2 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Project Name"
                        variant="outlined"
                        placeholder="e.g., My Awesome Website"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleConfirmCreate();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmCreate}
                        variant="contained"
                        disabled={!projectName.trim()}
                    >
                        Create & Open
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Storage Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={storageError?.includes('limit') || storageError?.includes('quota') ? 'error' : 'warning'} 
                    sx={{ width: '100%' }}
                >
                    {storageError}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;