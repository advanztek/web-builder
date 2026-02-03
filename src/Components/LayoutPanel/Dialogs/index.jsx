import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Menu,
    MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const AddPageDialog = ({ open, pageName, updatingProject, onClose, onChange, onSubmit }) => {
    return (
        <Dialog open={open} onClose={() => !updatingProject && onClose()}>
            <DialogTitle>Add New Page</DialogTitle>
            <DialogContent sx={{ width: 400, pt: 2 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Page Name"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g., About, Services, Contact"
                    value={pageName}
                    onChange={onChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !updatingProject) {
                            onSubmit();
                        }
                    }}
                    disabled={updatingProject}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={updatingProject}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={!pageName.trim() || updatingProject}
                    startIcon={updatingProject ? <CircularProgress size={20} /> : null}
                >
                    {updatingProject ? 'Adding...' : 'Add Page'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const EditPageDialog = ({ open, pageName, updatingProject, onClose, onChange, onSubmit }) => {
    return (
        <Dialog open={open} onClose={() => !updatingProject && onClose()}>
            <DialogTitle>Edit Page Name</DialogTitle>
            <DialogContent sx={{ width: 400, pt: 2 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Page Name"
                    fullWidth
                    variant="outlined"
                    value={pageName}
                    onChange={onChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !updatingProject) {
                            onSubmit();
                        }
                    }}
                    disabled={updatingProject}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={updatingProject}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={!pageName.trim() || updatingProject}
                    startIcon={updatingProject ? <CircularProgress size={20} /> : null}
                >
                    {updatingProject ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const EditFileDialog = ({
    open,
    fileTitle,
    fileDescription,
    updatingFile,
    onClose,
    onTitleChange,
    onDescriptionChange,
    onSubmit
}) => {
    return (
        <Dialog open={open} onClose={() => !updatingFile && onClose()}>
            <DialogTitle>Edit File Details</DialogTitle>
            <DialogContent sx={{ width: 400, pt: 2 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    variant="outlined"
                    value={fileTitle}
                    onChange={onTitleChange}
                    disabled={updatingFile}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={fileDescription}
                    onChange={onDescriptionChange}
                    disabled={updatingFile}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={updatingFile}>
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={updatingFile}
                    startIcon={updatingFile ? <CircularProgress size={20} /> : null}
                >
                    {updatingFile ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const PageMenu = ({ anchorEl, onClose, onEdit, onDelete }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            <MenuItem onClick={onEdit}>
                <Edit fontSize="small" sx={{ mr: 1 }} />
                Rename
            </MenuItem>
            <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                Delete
            </MenuItem>
        </Menu>
    );
};