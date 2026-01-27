import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const FaqItem = ({ question, answer, index, expanded, onChange }) => {
    const theme = useTheme();
    const isExpanded = expanded === `panel${index}`;

    return (
        <Accordion
            expanded={isExpanded}
            onChange={onChange}
            elevation={0}
            sx={{
                mb: 2,
                backgroundColor: theme.palette.background.paper,
                borderRadius: '16px !important',
                border: `2px solid ${isExpanded
                    ? theme.palette.primary.main
                    : theme.palette.divider}`,
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                '&:before': { display: 'none' },
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
                            backgroundColor: isExpanded
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
                                color: isExpanded
                                    ?
                                    theme.palette.primary.contrastText
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
                    '& .MuiAccordionSummary-content': { my: 0 },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: '8px',
                            background: isExpanded
                                ? `linear-gradient(135deg,
                                ${theme.palette.primary.main} 
                                0%, ${theme.palette.primary.dark} 100%)`
                                : theme.palette.mode === 'light'
                                    ? theme.palette.background.default
                                    : theme.palette.primary.lightBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                            color: isExpanded ? theme.palette.primary.contrastText : theme.palette.text.secondary,
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
                        {question}
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
                    {answer}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default FaqItem;
