import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const ColorPicker = ({ label, value, onChange, disabled }) => {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    type="color"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    sx={{ width: 60 }}
                />
                <TextField size="small" value={value} onChange={onChange} disabled={disabled} sx={{ flex: 1 }} />
            </Box>
        </Box>
    );
};

export default ColorPicker;