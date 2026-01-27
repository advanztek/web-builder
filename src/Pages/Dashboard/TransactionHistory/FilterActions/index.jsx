import React from 'react';
import { Grid, Stack, Button } from '@mui/material';
import { FilterList } from '@mui/icons-material';

const FilterActions = ({ onApply, onClear, theme }) => {
    return (
        <Grid size={{ xs:12 }}>
            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    onClick={onApply}
                    startIcon={<FilterList />}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Apply Filters
                </Button>
                <Button
                    variant="outlined"
                    onClick={onClear}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                    }}
                >
                    Clear Filters
                </Button>
            </Stack>
        </Grid>
    );
};

export default FilterActions;