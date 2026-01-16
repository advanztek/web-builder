import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Save,
  Download,
  Smartphone,
  Computer,
  Tablet,
  Visibility,
  ArrowBack,
} from '@mui/icons-material';
import { Workspace } from '../../../Components/WorkSpace';
import { LayoutPanel } from '../../../Components/Tools/LayoutPanel';
import { useCreateProject, useGetProject } from '../../../Hooks/projects';
import { setActiveProject } from '../../../Store/slices/projectsSlice';

function EditorPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [deviceMode, setDeviceMode] = useState('Desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const workspaceRef = useRef(null);

  // Use the custom hooks
  const { createProject, loading: creatingProject } = useCreateProject();
  const { getProject, project: apiProject, loading: loadingProject } = useGetProject();

  // Get active project from Redux
  const activeProjectId = useSelector(state => state.projects.activeProjectId);
  const reduxProject = useSelector(state =>
    activeProjectId ? state.projects.projects[activeProjectId] : null
  );

  // Use API project if available, otherwise use Redux project
  const project = apiProject || reduxProject;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    primaryColor: '#1976d2',
    secondaryColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    font: 'Inter'
  });
  const [error, setError] = useState('');

  // Load project when component mounts or projectId changes
  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        console.log('📂 Loading project from API:', projectId);
        const loadedProject = await getProject(projectId);

        if (loadedProject) {
          console.log('✅ Project loaded:', loadedProject.name || loadedProject.data?.name);
          dispatch(setActiveProject(loadedProject.id));
        }
      } else if (activeProjectId && !apiProject) {
        console.log('📂 Loading active project from API:', activeProjectId);
        await getProject(activeProjectId);
      }
    };

    loadProject();
  }, [projectId, activeProjectId]);

  // CRITICAL: project-updated event listener with FORCED refresh
  useEffect(() => {
    const handleProjectUpdate = async () => {
      console.log('🔄 Project update event received, FORCE reloading...');

      const idToLoad = projectId || activeProjectId;
      
      if (idToLoad) {
        // Force reload from backend
        const reloadedProject = await getProject(idToLoad);
        
        if (reloadedProject) {
          const pageCount = Object.keys(reloadedProject.data?.pages || {}).length;
          console.log('✅ Project FORCE reloaded with', pageCount, 'pages');
          
          // Force increment refresh key to re-render LayoutPanel
          setRefreshKey(prev => prev + 1);
          
          // Extra: Dispatch to Redux to ensure state is updated
          dispatch(setActiveProject(reloadedProject.id));
        }
      }
    };

    window.addEventListener('project-updated', handleProjectUpdate);
    
    return () => {
      window.removeEventListener('project-updated', handleProjectUpdate);
    };
  }, [projectId, activeProjectId, getProject, dispatch]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setError('');

    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim() || `Project: ${formData.name}`,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      backgroundColor: formData.backgroundColor,
      font: formData.font,
      seoTitle: formData.name.trim(),
      keywords: ['website', 'landing page', formData.name.toLowerCase()]
    };

    console.log('Creating project with:', projectData);

    try {
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
        setDialogOpen(false);
        setError('');

        // Set as active project and reload
        dispatch(setActiveProject(result.id));
        if (result.id) {
          await getProject(result.id);
          setRefreshKey(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Error in handleCreateProject:', err);
      setError(err.message || 'Failed to create project');
    }
  };

  const handleDialogClose = () => {
    if (!creatingProject) {
      setDialogOpen(false);
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

  const handleSave = () => {
    if (project) {
      console.log('💾 Manually saving project...');
      const event = new CustomEvent('manual-save');
      window.dispatchEvent(event);
    }
  };

  const handleExportHTML = () => {
    const event = new CustomEvent('export-html');
    window.dispatchEvent(event);
  };

  const handleDeviceChange = (device) => {
    setDeviceMode(device);
    const event = new CustomEvent('change-device', { detail: device });
    window.dispatchEvent(event);
  };

  const toggleBorders = () => {
    const event = new CustomEvent('toggle-borders');
    window.dispatchEvent(event);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Show loading state while fetching project
  if (loadingProject && !project) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading project...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar */}
      <AppBar position="static" elevation={0} sx={{ borderRadius: 0 }}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBackToDashboard}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Website Builder
          </Typography>

          {project ? (
            <Chip
              label={`Project: ${project.name || project.data?.name}`}
              sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          ) : (
            <Chip
              label="No Project Selected"
              sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          )}

          {/* Device Toggle */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            mr: 2,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.5
          }}>
            <Tooltip title="Desktop View">
              <IconButton
                size="small"
                onClick={() => handleDeviceChange('Desktop')}
                sx={{
                  color: deviceMode === 'Desktop' ? theme.palette.primary.main : 'white',
                  bgcolor: deviceMode === 'Desktop' ? 'white' : 'transparent'
                }}
              >
                <Computer />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tablet View">
              <IconButton
                size="small"
                onClick={() => handleDeviceChange('Tablet')}
                sx={{
                  color: deviceMode === 'Tablet' ? theme.palette.primary.main : 'white',
                  bgcolor: deviceMode === 'Tablet' ? 'white' : 'transparent'
                }}
              >
                <Tablet />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mobile View">
              <IconButton
                size="small"
                onClick={() => handleDeviceChange('Mobile')}
                sx={{
                  color: deviceMode === 'Mobile' ? theme.palette.primary.main : 'white',
                  bgcolor: deviceMode === 'Mobile' ? 'white' : 'transparent'
                }}
              >
                <Smartphone />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Toggle Borders">
            <IconButton onClick={toggleBorders} sx={{ color: 'white', mr: 1 }}>
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save Project">
            <IconButton
              onClick={handleSave}
              sx={{ color: 'white', mr: 1 }}
              disabled={!project}
            >
              <Save />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export HTML">
            <IconButton
              onClick={handleExportHTML}
              sx={{ color: 'white', mr: 2 }}
              disabled={!project}
            >
              <Download />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.dark,
              '&:hover': { bgcolor: theme.palette.primary.main }
            }}
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            disabled={creatingProject}
          >
            New Project
          </Button>
        </Toolbar>
      </AppBar>

      {/* Editor Layout */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Blocks & Pages */}
        <LayoutPanel key={refreshKey} project={project} />

        {/* Main Canvas - Workspace */}
        <Workspace ref={workspaceRef} project={project} />

        {/* Right Sidebar - Properties Panel */}
        <Box
          sx={{
            width: 280,
            bgcolor: '#141924',
            borderLeft: '1px solid #2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            color: '#e0e0e0',
            overflow: 'hidden'
          }}
        >
          {/* Properties Header */}
          <Box sx={{
            p: 2,
            borderBottom: '1px solid #2a2a2a',
            bgcolor: '#0d0d0d'
          }}>
            <Typography variant="h6" fontWeight="600" sx={{ color: '#e0e0e0' }}>
              Properties
            </Typography>
          </Box>

          {/* Style Manager */}
          <Box
            id="gjs-styles"
            sx={{
              flex: 1,
              overflowY: 'auto',
              '& .gjs-sm-sector': {
                borderBottom: '1px solid #2a2a2a'
              },
              '& .gjs-sm-title': {
                bgcolor: '#0d0d0d',
                color: '#b0b0b0',
                padding: '10px 12px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              },
              '& .gjs-sm-property': {
                color: '#e0e0e0',
                padding: '8px 12px'
              }
            }}
          />

          {/* Layers */}
          <Box
            id="gjs-layers"
            sx={{
              height: 200,
              borderTop: '1px solid #2a2a2a',
              overflowY: 'auto',
              bgcolor: '#0d0d0d'
            }}
          />

          {/* Traits */}
          <Box
            id="gjs-traits"
            sx={{
              height: 150,
              borderTop: '1px solid #2a2a2a',
              overflowY: 'auto',
              bgcolor: '#0d0d0d'
            }}
          />

          {/* Selectors */}
          <Box
            id="gjs-selectors"
            sx={{
              borderTop: '1px solid #2a2a2a',
              p: 1,
              bgcolor: '#0d0d0d'
            }}
          />
        </Box>
      </Box>

      {/* Create Project Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
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
            {/* Project Name */}
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Project Name"
                fullWidth
                variant="outlined"
                placeholder="e.g., My Awesome Landing Page"
                value={formData.name}
                onChange={handleInputChange('name')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !creatingProject && formData.name.trim()) {
                    handleCreateProject();
                  }
                }}
                disabled={creatingProject}
                required
                error={!formData.name.trim() && error !== ''}
                helperText="This will be the main name of your project"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                placeholder="Brief description of your project"
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={creatingProject}
                multiline
                rows={2}
                helperText="Optional: Describe what this project is about"
              />
            </Grid>

            {/* Theme Colors */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                Theme Colors
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={4}>
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

            {/* Font Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Font Family</InputLabel>
                <Select
                  value={formData.font}
                  onChange={handleInputChange('font')}
                  disabled={creatingProject}
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
          <Button
            onClick={handleDialogClose}
            disabled={creatingProject}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={!formData.name.trim() || creatingProject}
            startIcon={creatingProject ? <CircularProgress size={20} color="inherit" /> : <Add />}
          >
            {creatingProject ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditorPage;