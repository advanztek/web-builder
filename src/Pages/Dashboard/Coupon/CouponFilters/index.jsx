import React from 'react';
import {
    Paper,
    Stack,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const CouponFilters = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    onSearch,
}) => {
    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box component="form" onSubmit={onSearch} sx={{ flex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by code or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filterStatus}
                        label="Status"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={filterType}
                        label="Type"
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="percentage">Percentage</MenuItem>
                        <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Paper>
    );
};

export default CouponFilters;