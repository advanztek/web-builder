import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { OpenInNew, Edit, ContentCopy, Delete } from '@mui/icons-material';

const ProjectActionsMenu = ({ anchorEl, onClose, onOpen, onEdit, onDuplicate, onDelete }) => {
    return (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
            <MenuItem onClick={onOpen}>
                <ListItemIcon>
                    <OpenInNew fontSize="small" />
                </ListItemIcon>
                <ListItemText>Open</ListItemText>
            </MenuItem>
            <MenuItem onClick={onEdit}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
            </MenuItem>
            <MenuItem onClick={onDuplicate}>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Duplicate</ListItemText>
            </MenuItem>
            <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                    <Delete fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
            </MenuItem>
        </Menu>
    );
};

export default ProjectActionsMenu;