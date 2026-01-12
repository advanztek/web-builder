import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../Components/SideBar';
import DashboardNav from '../../Components/DashboardNav';

function DashboardLayout({ children }) {
  const location = useLocation();

  const noLayoutRoutes = ["/register", "/sample", "/login"];
  const hideLayout = noLayoutRoutes.includes(location.pathname);
  const isDashboardRoute = location.pathname === "/" || location.pathname === "/dashboard";
  const isEditorRoute = location.pathname === "/dashboard/editor" || location.pathname.startsWith("/dashboard/editor/");

  return (
    <>
      {!hideLayout && <DashboardNav />}
      <Box sx={{ display: "flex", overflowX: 'hidden', width: '100%', minHeight: "100vh" }}>
        {!hideLayout && (
          <Box component="nav">
            {/* <Sidebar /> */}
          </Box>
        )}

        <Box
          component="main"
          sx={{
            width: '100%',
            mx: 'auto',
            pl: isEditorRoute ? 0 : 7,
            bgcolor: isEditorRoute ? '#E5E5E5' : '#000',
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}

export default DashboardLayout;