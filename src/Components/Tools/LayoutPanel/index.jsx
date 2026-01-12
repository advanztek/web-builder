import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard,
  Add,
  MoreVert,
  Delete,
  Edit,
  Home as HomeIcon
} from '@mui/icons-material';
import { addPage, setActivePage, deletePage, updatePageName } from '../../../Store/slices/projectsSlice';

export const LayoutPanel = () => {
  const dispatch = useDispatch();
  const activeProjectId = useSelector(state => state.projects.activeProjectId);
  const project = useSelector(state =>
    activeProjectId ? state.projects.projects[activeProjectId] : null
  );

  const [addPageDialog, setAddPageDialog] = useState(false);
  const [editPageDialog, setEditPageDialog] = useState(false);
  const [pageName, setPageName] = useState('');
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPageId, setMenuPageId] = useState(null);

  const handleAddPage = () => {
    if (pageName.trim() && activeProjectId) {
      dispatch(addPage({ projectId: activeProjectId, pageName: pageName.trim() }));
      setPageName('');
      setAddPageDialog(false);
    }
  };

  const handlePageClick = (pageId) => {
    if (activeProjectId) {
      dispatch(setActivePage({ projectId: activeProjectId, pageId }));
    }
  };

  const handleMenuOpen = (event, pageId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuPageId(pageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPageId(null);
  };

  const handleEditPage = () => {
    const page = project?.pages[menuPageId];
    if (page && !page.isHome) {
      setPageName(page.name);
      setSelectedPageId(menuPageId);
      setEditPageDialog(true);
      handleMenuClose();
    }
  };

  const handleUpdatePageName = () => {
    if (pageName.trim() && activeProjectId && selectedPageId) {
      dispatch(updatePageName({
        projectId: activeProjectId,
        pageId: selectedPageId,
        name: pageName.trim()
      }));
      setPageName('');
      setSelectedPageId(null);
      setEditPageDialog(false);
    }
  };

  const handleDeletePage = () => {
    if (activeProjectId && menuPageId) {
      const page = project?.pages[menuPageId];
      if (page && !page.isHome) {
        dispatch(deletePage({ projectId: activeProjectId, pageId: menuPageId }));
      }
      handleMenuClose();
    }
  };

  const pages = project?.pages ? Object.values(project.pages) : [];

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: '#141924',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#e0e0e0'
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderBottom: '1px solid #2a2a2a'
      }}>
        <Dashboard sx={{ color: '#1976d2' }} />
        <Typography variant="h6" fontWeight="600" sx={{ color: '#e0e0e0' }}>
          Blocks
        </Typography>
      </Box>

      {/* Pages Section */}
      {activeProjectId && (
        <Box sx={{ borderBottom: '1px solid #2a2a2a' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: '#0d0d0d'
          }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#b0b0b0',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px'
              }}
            >
              Pages
            </Typography>
            <Tooltip title="Add Page">
              <IconButton
                size="small"
                onClick={() => setAddPageDialog(true)}
                sx={{ color: '#1976d2' }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <List sx={{ py: 0 }}>
            {pages.map((page) => (
              <ListItem
                key={page.id}
                disablePadding
                secondaryAction={
                  !page.isHome && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, page.id)}
                      sx={{ color: '#808080' }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  selected={project.activePageId === page.id}
                  onClick={() => handlePageClick(page.id)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: '#1976d2',
                      '&:hover': {
                        bgcolor: '#1565c0'
                      }
                    },
                    '&:hover': {
                      bgcolor: '#2a2a2a'
                    }
                  }}
                >
                  {page.isHome && (
                    <HomeIcon sx={{ mr: 1, fontSize: 18, color: '#1976d2' }} />
                  )}
                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: project.activePageId === page.id ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* GrapeJS Blocks Container */}
      <Box
        id="gjs-blocks"
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          '& .gjs-block-category': {
            marginBottom: 2
          },
          '& .gjs-title': {
            color: '#b0b0b0',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }}
      />

      {/* Empty State */}
      {!activeProjectId && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#808080' }}>
            Select or create a project to see available blocks
          </Typography>
        </Box>
      )}

      {/* Add Page Dialog */}
      <Dialog open={addPageDialog} onClose={() => setAddPageDialog(false)}>
        <DialogTitle>Add New Page</DialogTitle>
        <DialogContent sx={{ width: 400, pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Page Name"
            fullWidth
            variant="outlined"
            placeholder="e.g., About, Services, Contact"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddPage();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPageDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddPage}
            variant="contained"
            disabled={!pageName.trim()}
          >
            Add Page
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={editPageDialog} onClose={() => setEditPageDialog(false)}>
        <DialogTitle>Edit Page Name</DialogTitle>
        <DialogContent sx={{ width: 400, pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Page Name"
            fullWidth
            variant="outlined"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleUpdatePageName();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPageDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdatePageName}
            variant="contained"
            disabled={!pageName.trim()}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditPage}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleDeletePage} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};