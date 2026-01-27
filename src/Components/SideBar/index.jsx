import React, { useState } from 'react';
import { Box, IconButton, Drawer, useTheme } from '@mui/material';
import {
  Settings,
  ReceiptLong,
  Language,
  Description,
  People,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { TransactionsPanel } from './TransactionsPanel';
import { SettingsPanel } from './SettingsPanel';
import { DomainsPanel } from './DomainsPanel';
import { DocsPanel } from './DocsPanel';
import { UsersPanel } from './UsersPanel';
import { CreditPackagesPanel } from './CreditPackagesPanel';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = () => {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const theme = useTheme();
  const { isSuperAdmin } = useAuth();

  const getSidebarItems = () => {
    const baseItems = [
      { id: 'settings', icon: <Settings />, roles: ['user', 'super_admin'] },
      { id: 'transactions', icon: <ReceiptLong />, roles: ['user', 'super_admin'] },
      { id: 'domains', icon: <Language />, roles: ['user', 'super_admin'] },
      { id: 'docs', icon: <Description />, roles: ['user', 'super_admin'] },
    ];

    const adminItems = [
      { id: 'users', icon: <People />, roles: ['super_admin'] },
      { id: 'credit-packages', icon: <AccountBalanceWallet />, roles: ['super_admin'] },
    ];

    if (isSuperAdmin()) {
      return [...adminItems, ...baseItems];
    }

    return baseItems;
  };

  const sidebarItems = getSidebarItems();

  const handleHover = (id) => {
    setActiveDrawer(id);
  };

  const handleLeave = () => {
    setActiveDrawer(null);
  };

  return (
    <>
      <Box
        onMouseLeave={handleLeave}
        sx={{
          position: 'fixed',
          height: '100vh',
          width: '75px',
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
        {sidebarItems.map((item) => (
          <IconButton
            key={item.id}
            onMouseEnter={() => handleHover(item.id)}
            sx={{
              color: activeDrawer === item.id ? '#fff' : '#64748b',
              bgcolor: activeDrawer === item.id ? '#1a1f2e' : 'transparent',
              width: 48,
              height: 48,
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
        open={Boolean(activeDrawer)}
        onMouseLeave={handleLeave}
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
        <Box onMouseEnter={() => setActiveDrawer(activeDrawer)}>
          {activeDrawer === 'settings' && <SettingsPanel />}
          {activeDrawer === 'transactions' && <TransactionsPanel />}
          {activeDrawer === 'domains' && <DomainsPanel />}
          {activeDrawer === 'docs' && <DocsPanel />}
          {activeDrawer === 'users' && isSuperAdmin() && <UsersPanel />}
          {activeDrawer === 'credit-packages' && isSuperAdmin() && <CreditPackagesPanel />}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;