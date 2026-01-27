import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { useBuyCredits } from './UseBuyCredits';
import { getPackageColor, isPopularPackage } from './PackageUtils';
import LoadingSpinner from './LoadingSpinner';
import PageHeader from '../../../Components/PageHeader';
import PackageGrid from './PackageGrid';
import EmptyState from './EmptyState';

const BuyCreditsPage = () => {
  const theme = useTheme();
  const {
    packages,
    loading,
    hoveredCard,
    setHoveredCard,
    handleCheckout,
    handleBack,
  } = useBuyCredits();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 8,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <PageHeader
          title="Choose Your Credit Package"
          subtitle="Select the perfect plan to power your creative projects"
          onBack={handleBack}
          buttonText="Back to Dashboard"
          theme={theme}
        />

        {packages.length > 0 ? (
          <PackageGrid
            packages={packages}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            onCheckout={handleCheckout}
            getPackageColor={getPackageColor}
            isPopular={isPopularPackage}
            theme={theme}
          />
        ) : (
          <EmptyState />
        )}
      </Container>
    </Box>
  );
};

export default BuyCreditsPage;