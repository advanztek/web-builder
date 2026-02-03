import React from 'react';
import {
    TextField, InputAdornment, IconButton, Paper, CircularProgress
} from '@mui/material';
import { AutoAwesome, Send } from '@mui/icons-material';


export function AiPromptBar({ value, onChange, onSubmit, disabled, loading }) {
    const canSubmit = value.trim().length > 0 && !loading && !disabled;

    return (
        <Paper elevation={4} sx={{ p: 2, borderTop: '2px solid #667eea', bgcolor: '#0F172A', borderRadius: 0 }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Describe what you want to build…"
                value={value}
                onChange={onChange}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                        e.preventDefault();
                        onSubmit();
                    }
                }}
                disabled={disabled || loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AutoAwesome sx={{ color: '#667eea' }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onSubmit}
                                disabled={!canSubmit}
                                size="small"
                                sx={{
                                    bgcolor: '#667eea',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#764ba2' },
                                    '&:disabled': { bgcolor: '#404040', color: '#808080' },
                                }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : <Send fontSize="small" />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1a2e',
                        color: '#e0e0e0',
                        '& fieldset': { borderColor: '#2a2a3e' },
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: '#808080', opacity: 1 },
                }}
            />
        </Paper>
    );
}