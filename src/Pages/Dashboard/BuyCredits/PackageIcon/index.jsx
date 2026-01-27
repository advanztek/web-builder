import React from 'react';
import { Box } from '@mui/material';
import { Diamond, Rocket, Star } from '@mui/icons-material';
import { CrownFilled } from '@fluentui/react-icons';

const PackageIcon = ({ packageData }) => {
    const getIcon = () => {
        const name = packageData?.name?.toLowerCase();

        if (name?.includes('jumbo') || name?.includes('enterprise')) {
            return <CrownFilled style={{ fontSize: 50 }} />;
        } else if (name?.includes('premium') || name?.includes('business')) {
            return <Star sx={{ fontSize: 60 }} />;
        } else if (name?.includes('professional') || name?.includes('pro')) {
            return <Rocket sx={{ fontSize: 60 }} />;
        } else {
            return <Diamond sx={{ fontSize: 60 }} />;
        }
    };

    return (
        <Box
            sx={{
                width: 100,
                height: 100,
                margin: '0 auto 20px',
                backgroundColor: '#000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
            }}
        >
            {getIcon()}
        </Box>
    );
};

export default PackageIcon;