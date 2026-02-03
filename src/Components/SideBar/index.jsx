import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Tooltip,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Settings,
  ReceiptLong,
  Language,
  Description,
  People,
  AccountBalanceWallet,
  CardGiftcard,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { TransactionsPanel } from './TransactionsPanel';
import { SettingsPanel } from './SettingsPanel';
import { DomainsPanel } from './DomainsPanel';
import { DocsPanel } from './DocsPanel';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = () => {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin } = useAuth();

  const drawerItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      roles: ['user', 'super_admin'],
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <ReceiptLong />,
      roles: ['user'],
    },
    {
      id: 'domains',
      label: 'Domains',
      icon: <Language />,
      roles: ['user', 'super_admin'],
    },
    {
      id: 'docs',
      label: 'Docs',
      icon: <Description />,
      roles: ['user', 'super_admin'],
    },
  ];

  const redirectItems = [
    {
      id: 'credit-value',
      label: 'Credit Value',
      icon: <TrendingUp />,
      roles: ['super_admin'],
      path: '/dashboard/credit-value',
    },
    {
      id: 'credit-packages',
      label: 'Credit Packages',
      icon: <AccountBalanceWallet />,
      roles: ['super_admin'],
      path: '/dashboard/credit-packages',
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: <CardGiftcard />,
      roles: ['super_admin'],
      path: '/dashboard/coupons',
    },
  ];

  const filterByRole = (items) =>
    items.filter((item) =>
      item.roles.includes(isSuperAdmin() ? 'super_admin' : 'user')
    );

  const visibleDrawerItems = filterByRole(drawerItems);
  const visibleRedirectItems = filterByRole(redirectItems);

  const isActiveRoute = (path) =>
    path && location.pathname.startsWith(path);

  const handleDrawerOpen = (id) => {
    setActiveDrawer(id);
  };

  const handleDrawerClose = () => {
    setActiveDrawer(null);
  };

  return (
    <>
      <Box
        onMouseLeave={handleDrawerClose}
        sx={{
          position: 'fixed',
          height: '100vh',
          width: 75,
          mt: '63px',
          bgcolor: theme.palette.primary?.bg || '#0f1419',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          gap: 1.5,
          zIndex: 1300,
        }}
      >

        {visibleRedirectItems.map((item) => {
          const active = isActiveRoute(item.path);

          return (
            <Tooltip key={item.id} title={item.label} placement="right">
              <IconButton
                onClick={() => navigate(item.path)}
                sx={{
                  width: 48,
                  height: 48,
                  color: active ? '#38bdf8' : '#64748b',
                  bgcolor: active ? '#1a1f2e' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: '#1a1f2e',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}
        {visibleDrawerItems.map((item) => (
          <Tooltip key={item.id} title={item.label} placement="right">
            <IconButton
              onMouseEnter={() => handleDrawerOpen(item.id)}
              sx={{
                width: 48,
                height: 48,
                color: activeDrawer === item.id ? '#fff' : '#64748b',
                bgcolor:
                  activeDrawer === item.id ? '#1a1f2e' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#fff',
                  bgcolor: '#1a1f2e',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}

      </Box>

      <Drawer
        variant="persistent"
        anchor="left"
        open={Boolean(activeDrawer)}
        sx={{
          '& .MuiDrawer-paper': {
            mt: '60px',
            width: 340,
            left: '75px',
            bgcolor: '#141924',
            borderRight: '1px solid #1f2937',
            boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Fade in={Boolean(activeDrawer)} timeout={200}>
          <Box sx={{ height: '100%' }}>

            {activeDrawer === 'transactions' && <TransactionsPanel />}
            {activeDrawer === 'domains' && <DomainsPanel />}
            {activeDrawer === 'docs' && <DocsPanel />}
            {activeDrawer === 'settings' && <SettingsPanel />}
          </Box>
        </Fade>
      </Drawer>
    </>
  );
};

export default Sidebar;
