import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

const DeleteCouponDialog = ({ open, coupon, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the coupon{' '}
                    <strong>{coupon?.code}</strong>?
                </DialogContentText>
                <DialogContentText color="error" sx={{ mt: 1 }}>
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCouponDialog;