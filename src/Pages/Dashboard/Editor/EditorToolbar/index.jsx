import React from 'react';
import { AppBar, Toolbar, Typography, Tooltip, IconButton, Chip } from '@mui/material';
import { ArrowBack, AccountBalanceWallet } from '@mui/icons-material';
import DeviceModeSelector from '../DeviceModeSelector';
import ToolbarActions from '../ToolbarActions';

const EditorToolbar = ({
    project,
    creditBalance,
    deviceMode,
    creatingProject,
    onBack,
    onBuyCredits,
    onDeviceChange,
    onToggleBorders,
    onSave,
    onExport,
    onNewProject,
}) => {
    return (
        <AppBar position="static" elevation={0} sx={{ borderRadius: 0, bgcolor: '#141924' }}>
            <Toolbar>
                <Tooltip title="Back to Dashboard">
                    <IconButton edge="start" color="inherit" onClick={onBack} sx={{ mr: 2 }}>
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
                        onClick={onBuyCredits}
                        sx={{
                            mr: 2,
                            bgcolor: 'rgba(76, 175, 80, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(76, 175, 80, 0.5)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.3)' }
                        }}
                    />
                </Tooltip>

                {project ? (
                    <Chip
                        label={`Project: ${project.name}`}
                        sx={{
                            mr: 2,
                            bgcolor: 'rgba(102, 126, 234, 0.3)',
                            color: 'white',
                            border: '1px solid rgba(102, 126, 234, 0.5)'
                        }}
                    />
                ) : (
                    <Chip
                        label="No Project Selected"
                        sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                    />
                )}

                <DeviceModeSelector
                    deviceMode={deviceMode}
                    onDeviceChange={onDeviceChange}
                />

                <ToolbarActions
                    project={project}
                    creatingProject={creatingProject}
                    onToggleBorders={onToggleBorders}
                    onSave={onSave}
                    onExport={onExport}
                    onNewProject={onNewProject}
                />
            </Toolbar>
        </AppBar>
    );
};

export default EditorToolbar;