import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { FeaturesSection } from  '../../../Components'
import WhatMattersSection from '../../../Components/WhatMatters';
import TestimonialSection from '../../../Components/TestimonialSection';
import FAQSection from '../../../Components/FaqSection';
import FeaturesH from '../../../Components/LandingCmpnents/FeaturesH';
import HowItWorksH from '../../../Components/LandingCmpnents/HowItWorksH';
import PricingH from '../../../Components/LandingCmpnents/PricingH';
import LandingPage from '../../../Components/LandingPage';


const HomePage = () => {

  return (
    <>
    {/* // <Container maxWidth="lg"> */}
       <LandingPage />
       {/* <FeaturesSection />  
       <FeaturesH />
       <ToolsSection />  
       <PricingH />
       <WhatMattersSection /> 
       <HowItWorksH />
       <TestimonialSection />  
       <FAQSection />   */}
    {/* </Container> */}
    </>
  );
};

export default HomePage;