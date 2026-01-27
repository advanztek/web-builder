import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotifySnackbar = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotifySnackbar;