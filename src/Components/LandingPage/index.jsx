import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Chip,
    IconButton,
    useTheme,
    useMediaQuery,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import {
    Attach20Regular,
    BookOpen20Regular,
    Mic20Regular,
} from '@fluentui/react-icons';
import { ArrowUpward } from '@mui/icons-material';

const TypewriterPlaceholder = ({ theme }) => {
    const texts = [
        "Build a modern e-commerce platform with shopping cart and payment integration...",
        "Create a portfolio website with animated transitions and dark mode...",
        "Design a restaurant website with online ordering and reservation system...",
        "Develop a fitness tracking app with workout plans and progress charts...",
        "Build a social media dashboard with real-time analytics and notifications...",
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];
        const typingSpeed = isDeleting ? 30 : 50;
        const pauseBeforeDelete = 2000;
        const pauseBeforeNext = 500;

        if (!isDeleting && charIndex < currentText.length) {
            const timer = setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else if (!isDeleting && charIndex === currentText.length) {
            const timer = setTimeout(() => {
                setIsDeleting(true);
            }, pauseBeforeDelete);
            return () => clearTimeout(timer);
        } else if (isDeleting && charIndex > 0) {
            const timer = setTimeout(() => {
                setDisplayText(currentText.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else if (isDeleting && charIndex === 0) {
            const timer = setTimeout(() => {
                setIsDeleting(false);
                setTextIndex((textIndex + 1) % texts.length);
            }, pauseBeforeNext);
            return () => clearTimeout(timer);
        }
    }, [charIndex, isDeleting, textIndex, texts]);

    return (
        <Box
            sx={{
                color: theme.palette.text.disabled,
                fontSize: { xs: '14px', md: '16px' },
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
            }}
        >
            {displayText}
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    backgroundColor: theme.palette.text.disabled,
                    marginLeft: '2px',
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                        '0%, 49%': { opacity: 1 },
                        '50%, 100%': { opacity: 0 },
                    },
                }}
            />
        </Box>
    );
};

const LandingPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState('apps');
    const [inputValue, setInputValue] = useState('');

    const [showAllSuggestions, setShowAllSuggestions] = useState(false);

    const suggestions = [
        'Modern SaaS Landing Page',
        'Corporate Business Website',
        'Creative Portfolio Website',
        'Restaurant Website',
        'Healthcare Clinic Website',
        'Digital Marketing Agency',
        'Real Estate Website',
        'Fitness & Wellness Website',
        'Educational Platform',
        'E-commerce Store',
        'Travel Booking Website',
        'Music Streaming App',
        'Project Management Tool',
        'Food Delivery App',
        'Social Networking Site',
        'Video Conference Platform'
    ];

    const initialDisplayCount = 6;
    const displayedSuggestions = showAllSuggestions
        ? suggestions
        : suggestions.slice(0, initialDisplayCount);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.primary.bg} 20%,
          #1a0b2e 40%,
          #2d1b4e 60%,
          ${theme.palette.primary.bg} 80%,
          ${theme.palette.background.default} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 99, 132, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(54, 162, 235, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(255, 206, 86, 0.1) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: { xs: 4, md: 15 } }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography
                            variant={isMobile ? 'h3' : 'h1'}
                            sx={{
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, #ff6b9d 0%, #feca57 50%, #48dbfb 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.2,
                            }}
                        >
                            Create Without Limits
                        </Typography>
                        <Chip
                            label="BETA"
                            size="small"
                            sx={{
                                backgroundColor: theme.palette.error.main,
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                height: '24px',
                            }}
                        />
                    </Box>
                    <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{
                            color: theme.palette.text.secondary,
                            mt: 2,
                            fontWeight: 400,
                        }}
                    >
                        Change your ideas into reality, before your coffee gets cold.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            mb: 4,
                            p: 0.5,
                            borderRadius: "999px",
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        {[
                            { key: "apps", label: "Build Apps" },
                            { key: "comic", label: "Create Comic Book" },
                        ].map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    sx={{
                                        px: 3.5,
                                        py: 1,
                                        borderRadius: "999px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                        transition: "all 0.25s ease",
                                        backgroundColor: isActive
                                            ? theme.palette.action.selected
                                            : "transparent",
                                        color: isActive
                                            ? theme.palette.text.primary
                                            : theme.palette.text.secondary,
                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? theme.palette.action.selected
                                                : theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: theme.palette.background.glass,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 4,
                        p: { xs: 2, md: 4 },
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 4,
                        position: 'relative',
                    }}
                >
                    {!inputValue && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { xs: 16, md: 32 },
                                left: { xs: 16, md: 32 },
                                right: { xs: 16, md: 32 },
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}
                        >
                            <TypewriterPlaceholder theme={theme} />
                        </Box>
                    )}
                    <TextField
                        multiline
                        rows={isMobile ? 4 : 5}
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                color: theme.palette.text.primary,
                                fontSize: { xs: '14px', md: '16px' },
                            }
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                        mb: 0,
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': { backgroundColor: theme.palette.action.hover }
                                }}
                            >
                                <Attach20Regular />
                            </IconButton>
                            <Button
                                startIcon={<BookOpen20Regular />}
                                variant="outlined"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    borderColor: theme.palette.divider,
                                    textTransform: 'none',
                                    borderRadius: '24px',
                                    py: 0.5,
                                    px: 3,
                                    fontSize: { xs: '12px', sm: '14px' }
                                }}
                            >
                                Learn
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    borderColor: theme.palette.divider,
                                    textTransform: 'none',
                                    borderRadius: '24px',
                                    minWidth: 'auto',
                                    py: 0.5,
                                    px: 2,
                                    fontSize: { xs: '12px', sm: '14px' }
                                }}
                            >
                                us English (US)
                            </Button>
                            <IconButton
                                sx={{
                                    color: theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                }}
                            >
                                <Mic20Regular />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: theme.palette.text.secondary,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                }}
                            >
                                <ArrowUpward sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
                        {displayedSuggestions.map((suggestion, index) => (
                            <Chip
                                key={index}
                                label={suggestion}
                                onClick={() => setInputValue(suggestion)}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    borderRadius: 4,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.lightBg,
                                        cursor: 'pointer',
                                    },
                                    fontSize: { xs: '12px', sm: '14px' },
                                    px: { xs: 1, sm: 2 },
                                    py: { xs: 2, sm: 2.5 }
                                }}
                            />
                        ))}
                    </Box>

                    {suggestions.length > initialDisplayCount && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: theme.palette.divider,
                                    color: theme.palette.text.secondary,
                                    borderRadius: '50px',
                                    px: 4,
                                    py: 0.8,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: theme.palette.primary.lightBg,
                                    }
                                }}
                            >
                                {showAllSuggestions ? 'Show Less' : `Show All (${suggestions.length - initialDisplayCount} more)`}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};
export default LandingPage;