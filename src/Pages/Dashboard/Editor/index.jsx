import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  MenuItem,
  Collapse,
  Card,
  CardContent,
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
  ChevronLeft,
  ChevronRight,
  AccountBalanceWallet,
  AutoAwesome,
  EditNote,
} from '@mui/icons-material';
import { Workspace } from '../../../Components/WorkSpace';
import { LayoutPanel } from '../../../Components/Tools/LayoutPanel';
import { useCreateProject, useGetProject } from '../../../Hooks/projects';
import { setActiveProject } from '../../../Store/slices/projectsSlice';

// Custom scrollbar styles for the properties panel
const customScrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(180deg, #764ba2 0%, #667eea 100%)',
    width: '8px',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#667eea rgba(255, 255, 255, 0.05)',
};

function EditorPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams(); // Changed from projectId to slug to match route

  const [deviceMode, setDeviceMode] = useState('Desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [creditBalance] = useState(2500);
  const [loadedProject, setLoadedProject] = useState(null); // ADD THIS HERE
  const workspaceRef = useRef(null);

  const { createProject, loading: creatingProject } = useCreateProject();
  const { getProject, project: apiProject, loading: loadingProject } = useGetProject();

  const activeProjectId = useSelector(state => state.projects.activeProjectId);
  const reduxProject = useSelector(state =>
    activeProjectId ? state.projects.projects[activeProjectId] : null
  );

  const project = loadedProject || apiProject || reduxProject;

  // Log current project state
  useEffect(() => {
    console.log('📊 CURRENT PROJECT STATE:', {
      loadedProject: loadedProject?.id,
      apiProject: apiProject?.id,
      reduxProject: reduxProject?.id,
      finalProject: project?.id
    });
  }, [loadedProject, apiProject, reduxProject, project]);

  // Dialog states
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

  // COMPREHENSIVE PROJECT LOADING
  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        console.warn('No slug in URL');
        return;
      }

      console.log('🔍 EditorPage loading project:', slug);

      // Priority 1: Check navigation state
      if (location.state?.createdProject) {
        console.log('📦 Loading from navigation state');
        const proj = location.state.createdProject;
        console.log('📦 Project data:', proj);
        setLoadedProject(proj);
        dispatch(setActiveProject(proj.id));
        setRefreshKey(prev => prev + 1);
        return;
      }

      // Priority 2: Check sessionStorage
      const pendingProject = sessionStorage.getItem('pending_project');
      if (pendingProject) {
        try {
          const proj = JSON.parse(pendingProject);
          console.log('📦 Loading from sessionStorage');
          console.log('📦 Project data:', proj);
          setLoadedProject(proj);
          dispatch(setActiveProject(proj.id));
          sessionStorage.removeItem('pending_project');
          setRefreshKey(prev => prev + 1);
          return;
        } catch (e) {
          console.warn('Failed to parse sessionStorage:', e);
        }
      }

      // Priority 3: Load from API
      console.log('📦 Loading from API');
      const proj = await getProject(slug, false);
      if (proj) {
        console.log('📦 Project loaded from API:', proj);
        setLoadedProject(proj);
        dispatch(setActiveProject(proj.id));
        setRefreshKey(prev => prev + 1);
      } else {
        console.error('❌ Failed to load project');
      }
    };

    loadProject();
  }, [slug, location.state]);

  useEffect(() => {
    const handleProjectUpdate = async () => {
      const idToLoad = slug || activeProjectId;
      if (idToLoad) {
        const reloadedProject = await getProject(idToLoad, false);
        if (reloadedProject) {
          setRefreshKey(prev => prev + 1);
          dispatch(setActiveProject(reloadedProject.id));
        }
      }
    };

    window.addEventListener('project-updated', handleProjectUpdate);
    return () => window.removeEventListener('project-updated', handleProjectUpdate);
  }, [slug, activeProjectId, getProject, dispatch]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleCreateProjectClick = () => {
    setChoiceDialogOpen(true);
  };

  const handleChoiceClose = () => {
    setChoiceDialogOpen(false);
  };

  const handleChoiceAI = () => {
    setChoiceDialogOpen(false);
    navigate('/dashboard/prompts');
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

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setError('');

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const projectData = {
      mode: 'manual',
      data: {
        name: formData.name.trim(),
        slug: slug,
        title: formData.name.trim(),
        seo: {
          title: formData.name.trim(),
          description: formData.description.trim() || `Project: ${formData.name}`,
          keywords: ['website', 'landing page', formData.name.toLowerCase()]
        },
        theme: {
          font: formData.font,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          backgroundColor: formData.backgroundColor,
        },
        pages: {
          'page-1': {
            id: 'page-1',
            name: 'Home',
            slug: 'home',
            isHome: true,
            gjsData: {
              html: '',
              css: '',
              components: [],
              styles: []
            },
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        },
        sections: [],
        settings: {
          published: false,
          customDomain: null,
          analytics: {
            googleAnalyticsId: null,
            facebookPixelId: null
          }
        },
        status: 'draft',
        activePageId: 'page-1'
      }
    };

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
        setManualDialogOpen(false);
        setError('');

        dispatch(setActiveProject(result.id));
        if (result.id) {
          await getProject(result.id, false);
          setRefreshKey(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error('Error in handleCreateProject:', err);
      setError(err.message || 'Failed to create project');
    }
  };

  const handleSave = () => {
    const event = new CustomEvent('manual-save');
    window.dispatchEvent(event);
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

  const toggleRightPanel = () => {
    setRightPanelCollapsed(!rightPanelCollapsed);
  };

  const handleBuyCredits = () => {
    navigate('/dashboard/buy-credits');
  };

  if (loadingProject && !project) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading project...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ borderRadius: 0 }}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton edge="start" color="inherit" onClick={handleBackToDashboard} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Website Builder
          </Typography>

          <Tooltip title="Available Credits">
            <Chip
              icon={<AccountBalanceWallet sx={{ color: 'white !important' }} />}
              label={`${creditBalance.toLocaleString()} Credits`}
              onClick={handleBuyCredits}
              sx={{
                mr: 2,
                bgcolor: 'rgba(76, 175, 80, 0.2)',
                color: 'white',
                border: '1px solid rgba(76, 175, 80, 0.5)',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.3)',
                }
              }}
            />
          </Tooltip>

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

          <Box sx={{ display: 'flex', gap: 1, mr: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1, p: 0.5 }}>
            <Tooltip title="Desktop View">
              <IconButton size="small" onClick={() => handleDeviceChange('Desktop')} sx={{ color: deviceMode === 'Desktop' ? theme.palette.primary.main : 'white', bgcolor: deviceMode === 'Desktop' ? 'white' : 'transparent' }}>
                <Computer />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tablet View">
              <IconButton size="small" onClick={() => handleDeviceChange('Tablet')} sx={{ color: deviceMode === 'Tablet' ? theme.palette.primary.main : 'white', bgcolor: deviceMode === 'Tablet' ? 'white' : 'transparent' }}>
                <Tablet />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mobile View">
              <IconButton size="small" onClick={() => handleDeviceChange('Mobile')} sx={{ color: deviceMode === 'Mobile' ? theme.palette.primary.main : 'white', bgcolor: deviceMode === 'Mobile' ? 'white' : 'transparent' }}>
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
            <IconButton onClick={handleSave} sx={{ color: 'white', mr: 1 }} disabled={!project}>
              <Save />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export HTML">
            <IconButton onClick={handleExportHTML} sx={{ color: 'white', mr: 2 }} disabled={!project}>
              <Download />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.dark, '&:hover': { bgcolor: theme.palette.primary.main } }}
            startIcon={<Add />}
            onClick={handleCreateProjectClick}
            disabled={creatingProject}
          >
            New Project
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LayoutPanel key={refreshKey} project={project} />
        <Workspace ref={workspaceRef} project={project} />

        {/* Properties Sidebar with Custom Scrollbar */}
        <Box 
          sx={{ 
            width: rightPanelCollapsed ? 50 : 280, 
            bgcolor: '#141924', 
            borderLeft: '1px solid rgba(102, 126, 234, 0.2)',
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            color: '#e0e0e0', 
            overflow: 'hidden', 
            transition: 'width 0.3s ease',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 50%, rgba(102, 126, 234, 0.5) 100%)',
              boxShadow: '0 0 10px rgba(102, 126, 234, 0.3)',
            }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: rightPanelCollapsed ? 'center' : 'space-between', 
              alignItems: 'center', 
              p: 2, 
              borderBottom: '1px solid #2a2a2a', 
              bgcolor: '#0d0d0d',
              background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
            }}
          >
            {!rightPanelCollapsed && (
              <Typography 
                variant="h6" 
                fontWeight="600" 
                sx={{ 
                  color: '#e0e0e0',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Properties
              </Typography>
            )}
            <IconButton 
              onClick={toggleRightPanel} 
              size="small" 
              sx={{ 
                color: '#e0e0e0',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                }
              }}
            >
              {rightPanelCollapsed ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Box>

          <Collapse in={!rightPanelCollapsed} orientation="horizontal" sx={{ flex: 1 }}>
            <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box 
                id="gjs-styles" 
                sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  ...customScrollbarStyles,
                }} 
              />
              <Box 
                id="gjs-layers" 
                sx={{ 
                  height: 200, 
                  borderTop: '1px solid #2a2a2a', 
                  overflowY: 'auto', 
                  bgcolor: '#0d0d0d',
                  ...customScrollbarStyles,
                }} 
              />
              <Box 
                id="gjs-traits" 
                sx={{ 
                  height: 150, 
                  borderTop: '1px solid #2a2a2a', 
                  overflowY: 'auto', 
                  bgcolor: '#0d0d0d',
                  ...customScrollbarStyles,
                }} 
              />
              <Box 
                id="gjs-selectors" 
                sx={{ 
                  borderTop: '1px solid #2a2a2a', 
                  p: 1, 
                  bgcolor: '#0d0d0d',
                  overflowY: 'auto',
                  ...customScrollbarStyles,
                }} 
              />
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* Choice Dialog */}
      <Dialog open={choiceDialogOpen} onClose={handleChoiceClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>Choose Creation Method</DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%', cursor: 'pointer', border: `2px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { borderColor: theme.palette.primary.main, transform: 'translateY(-4px)', boxShadow: theme.shadows[4] } }} onClick={handleChoiceAI}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AutoAwesome sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>AI Prompts</Typography>
                  <Typography variant="body2" color="text.secondary">Let AI help you build your project with intelligent prompts</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%', cursor: 'pointer', border: `2px solid ${theme.palette.divider}`, transition: 'all 0.3s ease', '&:hover': { borderColor: theme.palette.secondary.main, transform: 'translateY(-4px)', boxShadow: theme.shadows[4] } }} onClick={handleChoiceManual}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <EditNote sx={{ fontSize: 64, color: theme.palette.secondary.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Manual Setup</Typography>
                  <Typography variant="body2" color="text.secondary">Configure your project settings manually</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleChoiceClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Manual Creation Dialog */}
      <Dialog open={manualDialogOpen} onClose={handleManualDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField autoFocus label="Project Name" fullWidth placeholder="e.g., My Awesome Landing Page" value={formData.name} onChange={handleInputChange('name')} disabled={creatingProject} required error={!formData.name.trim() && error !== ''} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Description" fullWidth placeholder="Brief description of your project" value={formData.description} onChange={handleInputChange('description')} disabled={creatingProject} multiline rows={2} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>Theme Colors</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Primary Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField type="color" value={formData.primaryColor} onChange={handleInputChange('primaryColor')} disabled={creatingProject} sx={{ width: 60 }} />
                  <TextField size="small" value={formData.primaryColor} onChange={handleInputChange('primaryColor')} disabled={creatingProject} sx={{ flex: 1 }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Secondary Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField type="color" value={formData.secondaryColor} onChange={handleInputChange('secondaryColor')} disabled={creatingProject} sx={{ width: 60 }} />
                  <TextField size="small" value={formData.secondaryColor} onChange={handleInputChange('secondaryColor')} disabled={creatingProject} sx={{ flex: 1 }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Background Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField type="color" value={formData.backgroundColor} onChange={handleInputChange('backgroundColor')} disabled={creatingProject} sx={{ width: 60 }} />
                  <TextField size="small" value={formData.backgroundColor} onChange={handleInputChange('backgroundColor')} disabled={creatingProject} sx={{ flex: 1 }} />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Font Family</InputLabel>
                <Select value={formData.font} onChange={handleInputChange('font')} disabled={creatingProject} label="Font Family">
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
          <Button onClick={handleManualDialogClose} disabled={creatingProject}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained" disabled={!formData.name.trim() || creatingProject} startIcon={creatingProject ? <CircularProgress size={20} color="inherit" /> : <Add />}>
            {creatingProject ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditorPage;