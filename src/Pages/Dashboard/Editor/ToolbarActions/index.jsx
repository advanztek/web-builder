import React from 'react';
import { IconButton, Tooltip, Button } from '@mui/material';
import { Visibility, Save, Download, Add } from '@mui/icons-material';

const ToolbarActions = ({
    project,
    creatingProject,
    onToggleBorders,
    onSave,
    onExport,
    onNewProject,
}) => {
    return (
        <>
            <Tooltip title="Toggle Borders">
                <IconButton onClick={onToggleBorders} sx={{ color: 'white', mr: 1 }}>
                    <Visibility />
                </IconButton>
            </Tooltip>

            <Tooltip title="Save Project">
                <IconButton onClick={onSave} sx={{ color: 'white', mr: 1 }} disabled={!project}>
                    <Save />
                </IconButton>
            </Tooltip>

            <Tooltip title="Export HTML">
                <IconButton onClick={onExport} sx={{ color: 'white', mr: 2 }} disabled={!project}>
                    <Download />
                </IconButton>
            </Tooltip>

            <Button
                variant="contained"
                sx={{
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#764ba2' },
                    fontWeight: 600
                }}
                startIcon={<Add />}
                onClick={onNewProject}
                disabled={creatingProject}
            >
                New Project
            </Button>
        </>
    );
};

export default ToolbarActions;