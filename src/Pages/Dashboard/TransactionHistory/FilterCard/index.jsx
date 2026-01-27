import React from 'react';
import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import FilterInputs from '../FilterInputs';
import FilterActions from '../FilterActions';
import SearchInput from '../SearchInput';

const FilterCard = ({
    filters,
    onFilterChange,
    onApply,
    onClear,
    theme
}) => {
    return (
        <Card
            sx={{
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FilterList sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Filters
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <SearchInput
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />

                    <FilterInputs
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />

                    <FilterActions
                        onApply={onApply}
                        onClear={onClear}
                        theme={theme}
                    />
                </Grid>
            </CardContent>
        </Card>
    );
};

export default FilterCard;