import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const RenameProjectDialog = ({ open, onClose, value, onChange, onSave }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogContent sx={{ width: 400, pt: 2 }}>
                <TextField
                    autoFocus
                    fullWidth
                    label="Project Name"
                    variant="outlined"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') onSave();
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave} variant="contained" disabled={!value.trim()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameProjectDialog;