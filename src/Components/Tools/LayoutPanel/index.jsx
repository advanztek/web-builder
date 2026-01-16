import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard,
  Add,
  MoreVert,
  Delete,
  Edit,
  Home as HomeIcon,
  Collections,
  Upload,
  VideoLibrary,
  InsertDriveFile
} from '@mui/icons-material';
import { setActivePage } from '../../../Store/slices/projectsSlice';
import { useUpdateProject } from '../../../Hooks/projects';
import { showToast } from '../../../Utils/toast';

export const LayoutPanel = ({ project }) => {
  const dispatch = useDispatch();
  const { updateProject, loading: updatingProject } = useUpdateProject();

  const [tabValue, setTabValue] = useState(0);
  const [addPageDialog, setAddPageDialog] = useState(false);
  const [editPageDialog, setEditPageDialog] = useState(false);
  const [pageName, setPageName] = useState('');
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPageId, setMenuPageId] = useState(null);
  
  // Gallery states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Track current active page locally
  const [currentPageId, setCurrentPageId] = useState(null);

  // Load gallery files and active page from project data
  useEffect(() => {
    if (project) {
      if (project.data?.gallery) {
        setUploadedFiles(project.data.gallery);
      }
      
      // Set initial active page
      const activeId = project.data?.activePageId || project.activePageId;
      if (activeId) {
        setCurrentPageId(activeId);
      } else {
        // Set first page as active if no active page
        const pages = project.data?.pages || project.pages || {};
        const firstPageId = Object.keys(pages)[0];
        if (firstPageId) {
          setCurrentPageId(firstPageId);
        }
      }
      
      console.log('📦 LayoutPanel updated with project:', {
        projectId: project.id,
        pagesCount: project.data?.pages ? Object.keys(project.data.pages).length : 0
      });
    }
  }, [project]);

  const handleAddPage = async () => {
    if (!pageName.trim()) {
      showToast.error('Page name is required');
      return;
    }
    
    if (!project) {
      showToast.error('No project found');
      return;
    }

    const projectId = project.id;

    try {
      // Create new page ID
      const newPageId = 'page_' + Date.now();
      const slug = pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      // Create new page object
      const newPage = {
        id: newPageId,
        name: pageName.trim(),
        slug: slug,
        isHome: false,
        gjsData: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      console.log('➕ Adding new page:', newPage.name);

      // Get current pages
      const currentPages = project.data?.pages || project.pages || {};
      const updatedPages = {
        ...currentPages,
        [newPageId]: newPage
      };

      // Prepare full update data
      const updateData = {
        ...(project.data || {}),
        pages: updatedPages
      };

      // Update backend with new page
      const result = await updateProject(projectId, updateData);
      
      if (result) {
        console.log('✅ Page added successfully');
        setPageName('');
        setAddPageDialog(false);
        showToast.success(`Page "${newPage.name}" added successfully!`);
        
        // Trigger project refresh
        window.dispatchEvent(new CustomEvent('project-updated'));
      }
    } catch (error) {
      console.error('❌ Error adding page:', error);
      showToast.error('Failed to add page');
    }
  };

  const handlePageClick = (pageId) => {
    if (!project?.id) return;

    console.log('📄 Switching to page:', pageId);
    
    // Update local state immediately for UI feedback
    setCurrentPageId(pageId);
    
    // Update Redux
    dispatch(setActivePage({ projectId: project.id, pageId }));
    
    // Trigger GrapeJS to load this page
    const event = new CustomEvent('change-page', { detail: { pageId, project } });
    window.dispatchEvent(event);
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
    const pages = project?.data?.pages || project?.pages || {};
    const page = pages[menuPageId];
    
    if (page && !page.isHome) {
      setPageName(page.name);
      setSelectedPageId(menuPageId);
      setEditPageDialog(true);
      handleMenuClose();
    }
  };

  const handleUpdatePageName = async () => {
    if (!pageName.trim() || !selectedPageId || !project) {
      return;
    }

    const projectId = project.id;

    try {
      console.log('✏️ Renaming page:', selectedPageId, 'to', pageName.trim());

      // Get current pages
      const currentPages = project.data?.pages || project.pages || {};
      
      // Update backend
      const updatedPages = {
        ...currentPages,
        [selectedPageId]: {
          ...currentPages[selectedPageId],
          name: pageName.trim(),
          slug: pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          updatedAt: Date.now()
        }
      };

      const updateData = {
        ...(project.data || {}),
        pages: updatedPages
      };

      const result = await updateProject(projectId, updateData);

      if (result) {
        console.log('✅ Page renamed successfully');
        setPageName('');
        setSelectedPageId(null);
        setEditPageDialog(false);
        showToast.success('Page renamed successfully!');
        
        // Trigger project refresh
        window.dispatchEvent(new CustomEvent('project-updated'));
      }
    } catch (error) {
      console.error('❌ Error updating page name:', error);
      showToast.error('Failed to rename page');
    }
  };

  const handleDeletePage = async () => {
    if (!menuPageId || !project) {
      return;
    }

    const projectId = project.id;

    try {
      const pages = project.data?.pages || project.pages || {};
      const page = pages[menuPageId];
      
      if (page && !page.isHome) {
        console.log('🗑️ Deleting page:', page.name);

        // Update backend
        const updatedPages = { ...pages };
        delete updatedPages[menuPageId];

        const updateData = {
          ...(project.data || {}),
          pages: updatedPages
        };

        const result = await updateProject(projectId, updateData);
        
        if (result) {
          console.log('✅ Page deleted successfully');
          showToast.success(`Page "${page.name}" deleted`);
          
          // If deleted page was active, switch to first page
          if (currentPageId === menuPageId) {
            const remainingPages = Object.keys(updatedPages);
            if (remainingPages.length > 0) {
              handlePageClick(remainingPages[0]);
            }
          }
          
          // Trigger project refresh
          window.dispatchEvent(new CustomEvent('project-updated'));
        }
      }
      handleMenuClose();
    } catch (error) {
      console.error('❌ Error deleting page:', error);
      showToast.error('Failed to delete page');
    }
  };

  // Gallery file upload handler
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    if (!project) {
      showToast.error('No project available');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const newFiles = [];

      for (const file of files) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        
        if (!validTypes.includes(file.type)) {
          setUploadError(`${file.name} is not a supported file type`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`${file.name} is too large. Max size is 10MB`);
          continue;
        }

        // Convert to base64 for storage
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const fileData = {
          id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
          uploadedAt: Date.now()
        };

        newFiles.push(fileData);
      }

      // Update local state
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);

      // Update project in backend
      const updateData = {
        ...(project.data || {}),
        gallery: updatedFiles
      };

      await updateProject(project.id, updateData);
      showToast.success(`${newFiles.length} file(s) uploaded!`);
      
      // Trigger project refresh
      window.dispatchEvent(new CustomEvent('project-updated'));

      // Add files to GrapeJS Asset Manager
      const event = new CustomEvent('add-assets', { detail: newFiles });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('File upload error:', error);
      setUploadError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!project) return;

    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);

    // Update project in backend
    const updateData = {
      ...(project.data || {}),
      gallery: updatedFiles
    };

    await updateProject(project.id, updateData);
    showToast.success('File deleted');
    
    // Trigger project refresh
    window.dispatchEvent(new CustomEvent('project-updated'));

    // Remove from GrapeJS Asset Manager
    const event = new CustomEvent('remove-asset', { detail: fileId });
    window.dispatchEvent(event);
  };

  const handleUseFile = (file) => {
    // Add to GrapeJS canvas
    const event = new CustomEvent('use-asset', { detail: file });
    window.dispatchEvent(event);
  };

  // Get pages array
  const pages = project?.data?.pages 
    ? Object.values(project.data.pages) 
    : project?.pages 
    ? Object.values(project.pages) 
    : [];

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
      {/* Header with Tabs */}
      <Box sx={{ borderBottom: '1px solid #2a2a2a' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
        }}>
          <Dashboard sx={{ color: '#1976d2' }} />
          <Typography variant="h6" fontWeight="600" sx={{ color: '#e0e0e0' }}>
            Builder
          </Typography>
        </Box>
        
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              color: '#808080',
              '&.Mui-selected': {
                color: '#1976d2'
              }
            }
          }}
        >
          <Tab label="Blocks" />
          <Tab label="Pages" />
          <Tab label="Gallery" />
        </Tabs>
      </Box>

      {/* Blocks Tab */}
      <Box
        id="gjs-blocks"
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: tabValue === 0 ? 'block' : 'none',
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
          },
          '& .gjs-block': {
            backgroundColor: '#2a2a2a',
            color: '#e0e0e0',
            border: '1px solid #3a3a3a',
            '&:hover': {
              backgroundColor: '#3a3a3a'
            }
          }
        }}
      />

      {/* Pages Tab */}
      <Box sx={{ 
        flex: 1, 
        display: tabValue === 1 ? 'flex' : 'none', 
        flexDirection: 'column' 
      }}>
        {project ? (
          <>
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
                Pages ({pages.length})
              </Typography>
              <Tooltip title="Add Page">
                <IconButton
                  size="small"
                  onClick={() => setAddPageDialog(true)}
                  sx={{ color: '#1976d2' }}
                  disabled={updatingProject}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <List sx={{ py: 0, flex: 1, overflowY: 'auto' }}>
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
                    selected={currentPageId === page.id}
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
                      <HomeIcon sx={{ mr: 1, fontSize: 18, color: currentPageId === page.id ? 'white' : '#1976d2' }} />
                    )}
                    <ListItemText
                      primary={page.name}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: currentPageId === page.id ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#808080' }}>
              Select or create a project to manage pages
            </Typography>
          </Box>
        )}
      </Box>

      {/* Gallery Tab */}
      <Box sx={{ 
        flex: 1, 
        display: tabValue === 2 ? 'flex' : 'none', 
        flexDirection: 'column' 
      }}>
        {project ? (
          <>
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
                Media ({uploadedFiles.length})
              </Typography>
              <Tooltip title="Upload Files">
                <IconButton
                  size="small"
                  component="label"
                  sx={{ color: '#1976d2' }}
                  disabled={uploading}
                >
                  {uploading ? <CircularProgress size={20} /> : <Upload fontSize="small" />}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*,video/mp4,video/webm"
                    onChange={handleFileUpload}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            {uploadError && (
              <Alert severity="error" sx={{ m: 2 }} onClose={() => setUploadError('')}>
                {uploadError}
              </Alert>
            )}

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {uploadedFiles.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Collections sx={{ fontSize: 48, color: '#404040', mb: 2 }} />
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    No files uploaded yet
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ color: '#606060', mt: 1 }}>
                    Click the upload button to add images or videos
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1
                }}>
                  {uploadedFiles.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        position: 'relative',
                        bgcolor: '#0d0d0d',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover .file-actions': {
                          opacity: 1
                        }
                      }}
                      onClick={() => handleUseFile(file)}
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          style={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover'
                          }}
                        />
                      ) : file.type.startsWith('video/') ? (
                        <Box sx={{
                          width: '100%',
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#1a1a1a'
                        }}>
                          <VideoLibrary sx={{ fontSize: 40, color: '#606060' }} />
                        </Box>
                      ) : (
                        <Box sx={{
                          width: '100%',
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#1a1a1a'
                        }}>
                          <InsertDriveFile sx={{ fontSize: 40, color: '#606060' }} />
                        </Box>
                      )}
                      
                      <Box
                        className="file-actions"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          sx={{ color: '#ff5252' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          p: 0.5,
                          bgcolor: '#0d0d0d',
                          color: '#808080',
                          fontSize: '0.65rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#808080' }}>
              Select or create a project to manage media
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add Page Dialog */}
      <Dialog open={addPageDialog} onClose={() => !updatingProject && setAddPageDialog(false)}>
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
              if (e.key === 'Enter' && !updatingProject) {
                handleAddPage();
              }
            }}
            disabled={updatingProject}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPageDialog(false)} disabled={updatingProject}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPage}
            variant="contained"
            disabled={!pageName.trim() || updatingProject}
            startIcon={updatingProject ? <CircularProgress size={20} /> : null}
          >
            {updatingProject ? 'Adding...' : 'Add Page'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={editPageDialog} onClose={() => !updatingProject && setEditPageDialog(false)}>
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
              if (e.key === 'Enter' && !updatingProject) {
                handleUpdatePageName();
              }
            }}
            disabled={updatingProject}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPageDialog(false)} disabled={updatingProject}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePageName}
            variant="contained"
            disabled={!pageName.trim() || updatingProject}
            startIcon={updatingProject ? <CircularProgress size={20} /> : null}
          >
            {updatingProject ? 'Updating...' : 'Update'}
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