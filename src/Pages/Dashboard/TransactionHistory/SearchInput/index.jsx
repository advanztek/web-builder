import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchInput = ({ value, onChange }) => {
    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <TextField
                fullWidth
                placeholder="Search transactions..."
                value={value}
                onChange={onChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
        </Grid>
    );
};

export default SearchInput;