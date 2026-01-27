import React from 'react';
import { TableRow, TableCell, Chip, IconButton, useTheme } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
        case 'published':
        case 'active':
            return 'success';
        case 'draft':
            return 'primary';
        case 'review':
            return 'warning';
        default:
            return 'default';
    }
};

const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    try {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
        const now = Date.now();
        const diff = now - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        return 'N/A';
    }
};

const ProjectTableRow = ({ project, onClick, onMenuOpen }) => {
    const theme = useTheme();
    const projectName = project.name || project.data?.name || 'Untitled';
    const status = project.data?.status || project.status || 'Draft';

    return (
        <TableRow
            sx={{
                '&:hover': { bgcolor: theme.palette.action.hover, cursor: 'pointer' },
            }}
            onClick={() => onClick(project)}
        >
            <TableCell sx={{ fontWeight: 500 }}>{projectName}</TableCell>
            <TableCell>
                <Chip label={status} color={getStatusColor(status)} size="small" />
            </TableCell>
            <TableCell sx={{ color: theme.palette.text.secondary }}>
                {formatDate(project.createdAt || project.created_at)}
            </TableCell>
            <TableCell sx={{ color: theme.palette.text.secondary }}>
                {formatDate(project.updatedAt || project.updated_at || project.createdAt || project.created_at)}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" onClick={(e) => onMenuOpen(e, project)}>
                    <MoreVert fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default ProjectTableRow;