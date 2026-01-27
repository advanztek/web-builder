import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

const FilterInputs = ({ filters, onFilterChange }) => {
    return (
        <>
            <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                    select
                    fullWidth
                    label="Status"
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                    select
                    fullWidth
                    label="Type"
                    value={filters.type}
                    onChange={(e) => onFilterChange('type', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                    <MenuItem value="deposit">Deposit</MenuItem>
                    <MenuItem value="withdrawal">Withdrawal</MenuItem>
                </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange('startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange('endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
            </Grid>
        </>
    );
};

export default FilterInputs;