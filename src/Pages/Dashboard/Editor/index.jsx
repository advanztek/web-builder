import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  useTheme
} from '@mui/material';
import {
  Add,
  Save,
  Download,
  Smartphone,
  Computer,
  Tablet,
  Visibility,
} from '@mui/icons-material';
import { Workspace } from '../../../Components/WorkSpace';
import { PropertiesPanel } from '../../../Components/PropertiesPanel';
import { LayoutPanel } from '../../../Components/Tools/LayoutPanel';
import { createProject, } from '../../../Store/slices/projectsSlice';

function EditorPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [deviceMode, setDeviceMode] = useState('Desktop');
  const workspaceRef = useRef(null);

  const activeProjectId = useSelector(state => state.projects.activeProjectId);
  const project = useSelector(state =>
    activeProjectId ? state.projects.projects[activeProjectId] : null
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const action = dispatch(createProject({ name: projectName }));
      setProjectName('');
      setDialogOpen(false);
    }
  };

  const handleSave = () => {
    // Get the GrapeJS editor instance from the Workspace component
    const editorElement = document.querySelector('.gjs-editor');
    if (editorElement && activeProjectId) {
      // The auto-save in Workspace handles this, but we can add visual feedback
      console.log('Manually saving project...');
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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar */}
      <AppBar position="static" elevation={0} sx={{borderRadius:0}}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Website Builder
          </Typography>

          {project ? (
            <Chip
              label={`Project: ${project.name}`}
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
            <IconButton onClick={handleSave} sx={{ color: 'white', mr: 1 }}>
              <Save />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export HTML">
            <IconButton onClick={handleExportHTML} sx={{ color: 'white', mr: 2 }}>
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
          >
            New Project
          </Button>
        </Toolbar>
      </AppBar>

      {/* Editor Layout */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Blocks */}
        <LayoutPanel />

        {/* Main Canvas - Workspace */}
        <Workspace ref={workspaceRef} />

        {/* Right Sidebar - Properties */}
        <PropertiesPanel />
      </Box>

      {/* Create Project Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent sx={{ width: 400, pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            variant="outlined"
            placeholder="e.g., My Awesome Website"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateProject();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={!projectName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditorPage;