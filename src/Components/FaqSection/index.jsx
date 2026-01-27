import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import SectionHeader from './SectionHeader';
import { faqData } from './data';
import FaqBottomCta from './FaqBottomCta';
import FaqList from './FaqList';
import DecorativeBg from './DecorativeBg';

function FAQSection() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <DecorativeBg />

            <Container maxWidth="md">
                <SectionHeader
                    title="Frequently Asked Questions"
                    subtitle="Got questions? We've got answers. Find everything you need to know about our web builder."
                />

                <FaqList faqs={faqData} />

                <FaqBottomCta />
            </Container>
        </Box>
    );
}

export default FAQSection;