import React from 'react';
import { Paper, Typography, Divider, Chip } from '@mui/material';

const PackageSummary = ({ credits, price, discount }) => {
    return (
        <Paper
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
            }}
        >
            <Typography fontWeight={600}>
                Package Summary
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
                Credits: {credits}
            </Typography>
            <Typography>
                Price: ₦{Number(price).toLocaleString()}
            </Typography>

            {discount > 0 && (
                <Chip
                    label={`${discount}% Discount Applied`}
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                />
            )}
        </Paper>
    );
};

export default PackageSummary;