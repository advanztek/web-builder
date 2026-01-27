import React from 'react';
import { Card, CardContent, Zoom } from '@mui/material';
import PackageIcon from '../PackageIcon';
import PackageInfo from '../PackageInfo';
import PackageFeatures from '../PackageFeatures';
import PopularBadge from '../PopularBadge';
import BuyButton from '../BuyBtn';

const PackageCard = ({
  pkg,
  index,
  isPopular,
  isHovered,
  onHover,
  onLeave,
  onCheckout,
  color,
  theme,
}) => {
  return (
    <Zoom in timeout={600 + index * 100}>
      <Card
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        sx={{
          height: '100%',
          position: 'relative',
          borderRadius: 4,
          overflow: 'visible',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: isPopular
            ? `3px solid ${theme.palette.primary.main}`
            : '1px solid transparent',
          transform: isHovered
            ? 'translateY(-10px) scale(1.02)'
            : isPopular
            ? 'scale(1.05)'
            : 'scale(1)',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0,0,0,0.2)'
            : isPopular
            ? '0 10px 30px rgba(102, 126, 234, 0.3)'
            : theme.shadows[2],
        }}
      >
        {isPopular && <PopularBadge theme={theme} />}

        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <PackageIcon packageData={pkg} />
          <PackageInfo pkg={pkg} theme={theme} />
          <PackageFeatures features={pkg.features} theme={theme} />
          <BuyButton onClick={onCheckout} color={color} theme={theme} />
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default PackageCard;