import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Box, IconButton, Drawer, useTheme } from '@mui/material';
import {
  Add,
  GridOn,
  TextFields,
  Person,
  Settings,
  Image,
  Palette,
  Description,
  ViewModule,
  Extension,
  FolderOpen,
} from '@mui/icons-material';

import {LayoutPanel} from '../Tools/LayoutPanel';
import TextPanel from '../Tools/TextPanel';
import ComponentsPanel from '../Tools/ComponentsPanel';
import SettingsPanel from '../Tools/SettingsPanel';
import {
  MediaPanel,
  StylePanel,
  PagesPanel,
  TemplatesPanel,
  IntegrationsPanel,
  ProjectsPanel,
} from '../Tools/Panels';

const Sidebar = ({ onComponentSelect }) => {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const location = useLocation();

  const theme = useTheme();

  const navigate = useNavigate();

  const isDashboardRoute = location.pathname === "/" || location.pathname === "/dashboard";

  const allSidebarItems = [
    { id: 'add', icon: <Add />, component: LayoutPanel, label: 'Add', showOnDashboard: false },
    { id: 'layout', icon: <GridOn />, component: LayoutPanel, label: 'Layout', showOnDashboard: false },
    { id: 'text', icon: <TextFields />, component: TextPanel, label: 'Text', showOnDashboard: false },
    { id: 'projects', icon: <FolderOpen />, component: ProjectsPanel, label: 'Projects', showOnDashboard: true },
    { id: 'media', icon: <Image />, component: MediaPanel, label: 'Media', showOnDashboard: true },
    { id: 'pages', icon: <Description />, component: PagesPanel, label: 'Pages', showOnDashboard: false },
    { id: 'templates', icon: <ViewModule />, component: TemplatesPanel, label: 'Templates', showOnDashboard: true },
    { id: 'integrations', icon: <Extension />, component: IntegrationsPanel, label: 'Integrations', showOnDashboard: false },
    { id: 'settings', icon: <Settings />, component: SettingsPanel, label: 'Settings', showOnDashboard: true },
  ];

  const sidebarItems = isDashboardRoute
    ? allSidebarItems.filter(item => item.showOnDashboard)
    : allSidebarItems;

  const handleIconHover = (itemId) => {
    setHoveredIcon(itemId);
    setActiveDrawer(itemId);
  };

  const handleDrawerLeave = () => {
    setHoveredIcon(null);
    setActiveDrawer(null);
  };

  const handleComponentSelect = (component) => {
    if (onComponentSelect) {
      onComponentSelect(component);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          height: '100vh',
          width: '75px',
          mt:'63px',
          bgcolor: theme.palette.primary.bg || '#0f1419',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 1.5,
          zIndex: 1300,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#374151',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#4b5563',
            },
          },
        }}
      >
        {/* Logo */}
        <Box
         onClick={() => navigate('/dashboard')}
          sx={{

            width: 50,
            height: 50,
            bgcolor: '#2563eb',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Box component="svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
            />
          </Box>
        </Box>

        {/* Sidebar Items */}
        {sidebarItems.map((item) => (
          <IconButton
            key={item.id}
            onMouseEnter={() => handleIconHover(item.id)}
            sx={{
              color: hoveredIcon === item.id ? '#fff' : '#64748b',
              bgcolor: hoveredIcon === item.id ? '#1a1f2e' : 'transparent',
              width: 48,
              height: 48,
              flexShrink: 0,
              '&:hover': {
                color: '#fff',
                bgcolor: '#1a1f2e',
              },
            }}
          >
            {item.icon}
          </IconButton>
        ))}
      </Box>

      <Drawer
        variant="persistent"
        anchor="left"
        open={activeDrawer !== null}
        sx={{
          '& .MuiDrawer-paper': {
            mt: '60px',
            width: 340,
            borderRadius: 0,
            left: '75px',
            bgcolor: '#141924',
            borderRight: '1px solid #1f2937',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.3)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '7px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#0f1419',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#374151',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#4b5563',
              },
            },
            '&::-webkit-scrollbar-button': {
              display: 'none',
            },
          },
        }}
        ModalProps={{
          keepMounted: false,
          BackdropProps: {
            invisible: true,
          },
        }}
        onMouseLeave={handleDrawerLeave}
      >
        <Box
          onMouseEnter={() => setHoveredIcon(activeDrawer)}
          sx={{ height: '100%' }}
        >
          {activeDrawer === 'add' && (
            <LayoutPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'layout' && (
            <LayoutPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'text' && (
            <TextPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'components' && (
            <ComponentsPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'projects' && (
            <ProjectsPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'media' && (
            <MediaPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'styles' && (
            <StylePanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'pages' && (
            <PagesPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'templates' && (
            <TemplatesPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'integrations' && (
            <IntegrationsPanel onSelect={handleComponentSelect} />
          )}
          {activeDrawer === 'settings' && (
            <SettingsPanel onSelect={handleComponentSelect} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;