import React from 'react';
import { Box, Tabs, Tab, Chip, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const DashboardTabs = ({ activeTab, onChange, counts, onCreateProject }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs
                value={activeTab}
                onChange={onChange}
                sx={{ '& .MuiTab-root': { fontSize: '1.1rem', fontWeight: 500, textTransform: 'none', minHeight: 64, px: 3 } }}
            >
                <Tab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span style={{ fontSize: '1.3rem' }}>📁</span>
                            <span>My Projects</span>
                            <Chip label={counts.total} size="small" color="primary" sx={{ height: 20, fontSize: '0.75rem' }} />
                        </Box>
                    }
                />
                <Tab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span style={{ fontSize: '1.3rem' }}>🚀</span>
                            <span>Published</span>
                            <Chip label={counts.published} size="small" color="success" sx={{ height: 20, fontSize: '0.75rem' }} />
                        </Box>
                    }
                />
                <Tab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span style={{ fontSize: '1.3rem' }}>⭐</span>
                            <span>Favorites</span>
                            <Chip label={counts.favorites} size="small" color="warning" sx={{ height: 20, fontSize: '0.75rem' }} />
                        </Box>
                    }
                />
            </Tabs>

            <Button variant="contained" size="large" startIcon={<Add />} onClick={onCreateProject} sx={{ px: 3, py: 1.2, fontSize: '1rem', fontWeight: 600, my: 1 }}>
                Create New Project
            </Button>
        </Box>
    );
};

export default DashboardTabs;