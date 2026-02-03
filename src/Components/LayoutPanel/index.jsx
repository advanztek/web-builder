import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { GalleryTab } from './GalleryTab';
import { PagesTab } from './PagesTab';
import { AddPageDialog, EditPageDialog, EditFileDialog, PageMenu } from './Dialogs';
import { usePageManagement } from './UsePageManagement';
import { useGalleryManagement } from './UseGalleryManagement';

export const LayoutPanel = ({ project }) => {
  const [tabValue, setTabValue] = useState(0);

  // Page management
  const {
    addPageDialog,
    editPageDialog,
    pageName,
    currentPageId,
    updatingProject,
    anchorEl,
    setAddPageDialog,
    setEditPageDialog,
    setPageName,
    handleAddPage,
    handlePageClick,
    handleMenuOpen,
    handleMenuClose,
    handleEditPage,
    handleUpdatePageName,
    handleDeletePage
  } = usePageManagement(project);

  const {
    displayFiles,
    loadingGallery,
    loadingSorted,
    uploadingFile,
    updatingFile,
    filterType,
    sortingEnabled,
    editFileDialog,
    fileTitle,
    fileDescription,
    loadGalleryFiles,
    handleFileUpload,
    handleEditFile,
    handleUpdateFile,
    handleDeleteFile,
    handleUseFile,
    handleFilterChange,
    handleLoadMore,
    setEditFileDialog,
    setFileTitle,
    setFileDescription
  } = useGalleryManagement();

  useEffect(() => {
    if (tabValue === 2) {
      loadGalleryFiles();
    }
  }, [tabValue, filterType]);

  const pages = project?.data?.pages || project?.pages || {};
  const pagesArray = Object.values(pages);

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

      <Box sx={{
        flex: 1,
        display: tabValue === 1 ? 'flex' : 'none',
        flexDirection: 'column'
      }}>
        <PagesTab
          project={project}
          pagesArray={pagesArray}
          currentPageId={currentPageId}
          updatingProject={updatingProject}
          onAddPage={() => setAddPageDialog(true)}
          onPageClick={handlePageClick}
          onMenuOpen={handleMenuOpen}
        />
      </Box>

      <Box sx={{
        flex: 1,
        display: tabValue === 2 ? 'flex' : 'none',
        flexDirection: 'column'
      }}>
        <GalleryTab
          displayFiles={displayFiles}
          loadingGallery={loadingGallery}
          loadingSorted={loadingSorted}
          uploadingFile={uploadingFile}
          filterType={filterType}
          sortingEnabled={sortingEnabled}
          onFileUpload={handleFileUpload}
          onFilterChange={handleFilterChange}
          onEditFile={handleEditFile}
          onDeleteFile={handleDeleteFile}
          onUseFile={handleUseFile}
          onLoadMore={handleLoadMore}
        />
      </Box>

      <AddPageDialog
        open={addPageDialog}
        pageName={pageName}
        updatingProject={updatingProject}
        onClose={() => setAddPageDialog(false)}
        onChange={(e) => setPageName(e.target.value)}
        onSubmit={handleAddPage}
      />

      <EditPageDialog
        open={editPageDialog}
        pageName={pageName}
        updatingProject={updatingProject}
        onClose={() => setEditPageDialog(false)}
        onChange={(e) => setPageName(e.target.value)}
        onSubmit={handleUpdatePageName}
      />

      <EditFileDialog
        open={editFileDialog}
        fileTitle={fileTitle}
        fileDescription={fileDescription}
        updatingFile={updatingFile}
        onClose={() => setEditFileDialog(false)}
        onTitleChange={(e) => setFileTitle(e.target.value)}
        onDescriptionChange={(e) => setFileDescription(e.target.value)}
        onSubmit={handleUpdateFile}
      />

      <PageMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onEdit={handleEditPage}
        onDelete={handleDeletePage}
      />
    </Box>
  );
};