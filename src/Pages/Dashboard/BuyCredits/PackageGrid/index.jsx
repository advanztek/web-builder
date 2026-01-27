import React from 'react';
import { Grid } from '@mui/material';
import PackageCard from '../PackageCard';

const PackageGrid = ({
    packages,
    hoveredCard,
    setHoveredCard,
    onCheckout,
    getPackageColor,
    isPopular,
    theme,
}) => {
    return (
        <Grid container spacing={4}>
            {packages.map((pkg, index) => {
                const popular = isPopular(pkg, index);
                const color = getPackageColor(index);

                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pkg.id}>
                        <PackageCard
                            pkg={pkg}
                            index={index}
                            isPopular={popular}
                            isHovered={hoveredCard === pkg.id}
                            onHover={() => setHoveredCard(pkg.id)}
                            onLeave={() => setHoveredCard(null)}
                            onCheckout={() => onCheckout(pkg)}
                            color={color}
                            theme={theme}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default PackageGrid;