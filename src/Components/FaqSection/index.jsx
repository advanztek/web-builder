import { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import { ExpandMore, HelpOutline } from '@mui/icons-material';

function FAQSection() {
    const theme = useTheme();
    const [expanded, setExpanded] = useState('panel0');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            question: "How easy is it to get started with the web builder?",
            answer: "Getting started is incredibly simple! Just sign up for a free account, choose from our extensive template library, and start customizing with our intuitive drag-and-drop editor. No coding knowledge required. Most users create their first page within 30 minutes."
        },
        {
            question: "Can I use my own custom domain?",
            answer: "Absolutely! You can connect any domain you own to your website. We support all major domain providers and provide step-by-step instructions for setup. The process typically takes just a few minutes, and our support team is always ready to help if needed."
        },
        {
            question: "Is my website mobile-responsive automatically?",
            answer: "Yes! Every template and component is designed to be fully responsive out of the box. Your website will automatically adapt to any screen size - desktop, tablet, or mobile. You can also fine-tune the mobile experience with our dedicated mobile editor."
        },
        {
            question: "What kind of support do you offer?",
            answer: "We provide comprehensive 24/7 support through multiple channels including live chat, email, and an extensive knowledge base. Premium plans include priority support with faster response times and dedicated account managers for enterprise customers."
        },
        {
            question: "Can I export my website or move it elsewhere?",
            answer: "Yes, you have complete ownership of your content. You can export your website's HTML, CSS, and assets at any time. We believe in giving you full control over your work, with no vendor lock-in."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and for enterprise plans, we can arrange wire transfers or custom invoicing. All transactions are secured with industry-standard encryption."
        },
        {
            question: "Do you offer a free trial?",
            answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all our tools, templates, and features risk-free before deciding on a paid plan."
        },
        {
            question: "How do updates and new features work?",
            answer: "All updates and new features are automatically included in your plan at no extra cost. We continuously improve our platform based on user feedback and industry trends. You'll always have access to the latest tools and capabilities."
        }
    ];

    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                    top: '-100px',
                    right: '-100px',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
                    bottom: '-50px',
                    left: '-50px',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="md">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 24px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                        }}
                    >
                        <HelpOutline sx={{ fontSize: 40, color: theme.palette.primary.contrastText }} />
                    </Box>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '32px', md: '42px' },
                            mb: 2,
                            color: theme.palette.text.heading,
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Got questions? We've got answers. Find everything you need to know about our web builder.
                    </Typography>
                </Box>

                {/* FAQ Accordions */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            elevation={0}
                            sx={{
                                mb: 2,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '16px !important',
                                border: `2px solid ${expanded === `panel${index}` ? theme.palette.primary.main : theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                                '&:before': {
                                    display: 'none',
                                },
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: `0 4px 20px ${theme.palette.primary.main}15`,
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: expanded === `panel${index}`
                                                ? theme.palette.primary.main
                                                : theme.palette.mode === 'light'
                                                    ? theme.palette.background.default
                                                    : theme.palette.primary.lightBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <ExpandMore
                                            sx={{
                                                color: expanded === `panel${index}`
                                                    ? theme.palette.primary.contrastText
                                                    : theme.palette.text.primary,
                                                fontSize: 24,
                                            }}
                                        />
                                    </Box>
                                }
                                sx={{
                                    py: 2,
                                    px: 3,
                                    minHeight: '72px',
                                    '& .MuiAccordionSummary-content': {
                                        my: 0,
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Question Number Badge */}
                                    <Box
                                        sx={{
                                            minWidth: 32,
                                            height: 32,
                                            borderRadius: '8px',
                                            background: expanded === `panel${index}`
                                                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                                                : theme.palette.mode === 'light'
                                                    ? theme.palette.background.default
                                                    : theme.palette.primary.lightBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '14px',
                                            color: expanded === `panel${index}`
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.secondary,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '15px', md: '17px' },
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        {faq.question}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    px: 3,
                                    pb: 3,
                                    pt: 0,
                                    pl: { xs: 3, md: 10 },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        lineHeight: 1.8,
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* Bottom CTA */}
                <Box
                    sx={{
                        mt: 8,
                        p: 4,
                        borderRadius: '20px',
                        background: theme.palette.mode === 'light'
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`
                            : `linear-gradient(135deg, ${theme.palette.primary.lightBg} 0%, ${theme.palette.primary.bg} 100%)`,
                        border: `2px solid ${theme.palette.divider}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Still have questions?
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: theme.palette.text.secondary,
                            mb: 3,
                        }}
                    >
                        Can't find the answer you're looking for? Our support team is here to help.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Box
                            component="a"
                            href="#"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '8px',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 600,
                                fontSize: '15px',
                                textDecoration: 'none',
                                display: 'inline-block',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                                },
                            }}
                        >
                            Contact Support
                        </Box>
                        <Box
                            component="a"
                            href="#"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                fontSize: '15px',
                                textDecoration: 'none',
                                display: 'inline-block',
                                border: `2px solid ${theme.palette.primary.main}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            View Documentation
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default FAQSection;