import React from 'react';
import { Typography } from '@mui/material';

const PackageInfo = ({ pkg, theme }) => {
    return (
        <>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 2,
                    textTransform: 'capitalize',
                }}
            >
                {pkg.name}
            </Typography>

            {pkg.credit_amount && (
                <>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 1,
                        }}
                    >
                        {Number(pkg.credit_amount).toLocaleString()}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 2,
                        }}
                    >
                        Credits
                    </Typography>
                </>
            )}

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                }}
            >
                {pkg.currency} {Number(pkg.price).toLocaleString()}
            </Typography>

            {pkg.description && (
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        fontStyle: 'italic',
                    }}
                >
                    {pkg.description}
                </Typography>
            )}
        </>
    );
};

export default PackageInfo;