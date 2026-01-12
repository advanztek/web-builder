// DocumentationPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    Search as SearchIcon,
    Article as ArticleIcon,
    VideoLibrary as VideoIcon,
    School as SchoolIcon,
    Terminal as TerminalIcon,
    Storage as StorageIcon,
    Psychology as PsychologyIcon,
    ExpandMore as ExpandMoreIcon,
    NavigateNext as NavigateNextIcon,
    Code as CodeIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const DocumentationPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'getting-started', label: 'Getting Started', icon: <SchoolIcon /> },
        { id: 'guides', label: 'Guides', icon: <ArticleIcon /> },
        { id: 'api', label: 'API Reference', icon: <TerminalIcon /> },
        { id: 'tutorials', label: 'Video Tutorials', icon: <VideoIcon /> },
        { id: 'database', label: 'Database', icon: <StorageIcon /> },
        { id: 'ai-features', label: 'AI Features', icon: <PsychologyIcon /> }
    ];

    const faqs = [
        {
            question: 'How do I get started with Web Builder?',
            answer: 'Getting started is easy! Sign up for a free account, choose a template or start from scratch, and use our drag-and-drop editor to build your application. Our quick start guide will walk you through the process step by step.'
        },
        {
            question: 'Can I deploy to my own domain?',
            answer: 'Yes! All paid plans include custom domain support. Simply connect your domain in the settings panel, and we\'ll handle the DNS configuration automatically. SSL certificates are included for free.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through Stripe.'
        },
        {
            question: 'Is my code accessible and exportable?',
            answer: 'Absolutely! You have full access to your code at all times. You can export your entire project as a zip file, push to GitHub, or deploy to any hosting provider. We believe in no vendor lock-in.'
        },
        {
            question: 'What kind of support do you offer?',
            answer: 'We offer email support for all users, priority support for Pro plan subscribers, and 24/7 dedicated support for Enterprise customers. We also have extensive documentation, video tutorials, and an active community forum.'
        },
        {
            question: 'Can I collaborate with my team?',
            answer: 'Yes! Professional and Enterprise plans include team collaboration features. You can invite team members, set permissions, and work together in real-time on your projects.'
        }
    ];

    const quickLinks = [
        { title: 'Installation', icon: <CloudUploadIcon />, time: '2 min read' },
        { title: 'First Project', icon: <CodeIcon />, time: '5 min read' },
        { title: 'Deployment', icon: <SpeedIcon />, time: '3 min read' },
        { title: 'Security Best Practices', icon: <SecurityIcon />, time: '8 min read' }
    ];

    return (
        <Box sx={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 12,
                    pb: 6,
                    background: 'radial-gradient(circle at 50% 0%, rgba(74, 158, 255, 0.1) 0%, #000 50%)'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Documentation
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#999', maxWidth: 700, mx: 'auto', mb: 4 }}>
                            Everything you need to know about building with Web Builder
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            fullWidth
                            placeholder="Search documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                maxWidth: 600,
                                mx: 'auto',
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.1)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(74, 158, 255, 0.5)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4A9EFF'
                                    }
                                },
                                '& input': {
                                    color: '#fff',
                                    fontSize: '1.1rem'
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#4A9EFF' }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card
                            sx={{
                                background: 'rgba(17, 17, 17, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                position: 'sticky',
                                top: 100
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: '#999',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        mb: 2,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Categories
                                </Typography>
                                <List sx={{ p: 0 }}>
                                    {categories.map((category) => (
                                        <ListItem key={category.id} disablePadding sx={{ mb: 1 }}>
                                            <ListItemButton
                                                selected={selectedCategory === category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                sx={{
                                                    borderRadius: '12px',
                                                    '&.Mui-selected': {
                                                        backgroundColor: 'rgba(74, 158, 255, 0.15)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(74, 158, 255, 0.2)'
                                                        }
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{ color: selectedCategory === category.id ? '#4A9EFF' : '#888', minWidth: 40 }}>
                                                    {category.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={category.label}
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            color: selectedCategory === category.id ? '#4A9EFF' : '#ccc',
                                                            fontWeight: selectedCategory === category.id ? 600 : 400
                                                        }
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs:12, md:9 }}>
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" sx={{ color: '#666' }} />}
                            sx={{ mb: 4 }}
                        >
                            <Link href="#" underline="hover" sx={{ color: '#888', '&:hover': { color: '#4A9EFF' } }}>
                                Documentation
                            </Link>
                            <Typography sx={{ color: '#fff' }}>
                                {categories.find(c => c.id === selectedCategory)?.label}
                            </Typography>
                        </Breadcrumbs>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Quick Start
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            {quickLinks.map((link, index) => (
                                <Grid size={{ xs:12, sm:6 }} key={index}>
                                    <Card
                                        sx={{
                                            background: 'rgba(17, 17, 17, 0.6)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            transition: 'all 0.3s',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                borderColor: 'rgba(74, 158, 255, 0.4)',
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 24px rgba(74, 158, 255, 0.15)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2
                                                    }}
                                                >
                                                    {link.icon}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {link.title}
                                                    </Typography>
                                                    <Chip
                                                        label={link.time}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(74, 158, 255, 0.2)',
                                                            color: '#4A9EFF',
                                                            fontSize: '0.75rem',
                                                            height: 24
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* FAQ Section */}
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Frequently Asked Questions
                        </Typography>
                        <Box>
                            {faqs.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    sx={{
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '16px !important',
                                        mb: 2,
                                        '&:before': {
                                            display: 'none'
                                        },
                                        '&.Mui-expanded': {
                                            borderColor: 'rgba(74, 158, 255, 0.3)'
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#4A9EFF' }} />}
                                        sx={{
                                            '& .MuiAccordionSummary-content': {
                                                my: 2
                                            }
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{ color: '#aaa', lineHeight: 1.8 }}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                        {/* Additional Resources */}
                        <Box
                            sx={{
                                mt: 6,
                                p: 4,
                                background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(107, 95, 255, 0.1) 100%)',
                                borderRadius: '24px',
                                border: '1px solid rgba(74, 158, 255, 0.2)'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                Need More Help?
                            </Typography>
                            <Typography sx={{ color: '#aaa', mb: 3 }}>
                                Can't find what you're looking for? Our support team is here to help.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <button
                                    style={{
                                        padding: '12px 32px',
                                        background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                >
                                    Contact Support
                                </button>
                                <button
                                    style={{
                                        padding: '12px 32px',
                                        background: 'transparent',
                                        border: '2px solid rgba(74, 158, 255, 0.5)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.borderColor = '#4A9EFF';
                                        e.target.style.backgroundColor = 'rgba(74, 158, 255, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.borderColor = 'rgba(74, 158, 255, 0.5)';
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    Join Community
                                </button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DocumentationPage;