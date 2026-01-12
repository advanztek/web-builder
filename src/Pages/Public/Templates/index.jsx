// TemplatesPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Tabs,
    Tab
} from '@mui/material';
import {
    Search as SearchIcon,
    Storefront as StorefrontIcon,
    Palette as PaletteIcon,
    Business as BusinessIcon,
    RocketLaunch as RocketIcon,
    Article as ArticleIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';

const TemplatesPage = () => {
    const [activeCategory, setActiveCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All Templates', 'Business', 'Creative', 'Technology', 'Marketing', 'Content'];

    const templates = [
        {
            name: 'E-Commerce Store',
            category: 'Business',
            icon: <StorefrontIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            features: ['Payment Integration', 'Product Management', 'Shopping Cart'],
            downloads: '12.5k'
        },
        {
            name: 'Portfolio Website',
            category: 'Creative',
            icon: <PaletteIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            features: ['Gallery', 'Contact Form', 'Blog'],
            downloads: '8.2k'
        },
        {
            name: 'SaaS Platform',
            category: 'Technology',
            icon: <BusinessIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            features: ['User Dashboard', 'Analytics', 'Billing'],
            downloads: '15.7k'
        },
        {
            name: 'Landing Page',
            category: 'Marketing',
            icon: <RocketIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            features: ['Lead Capture', 'A/B Testing', 'Analytics'],
            downloads: '22.1k'
        },
        {
            name: 'Blog Platform',
            category: 'Content',
            icon: <ArticleIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            features: ['CMS', 'SEO Tools', 'Comments'],
            downloads: '9.8k'
        },
        {
            name: 'Social Network',
            category: 'Technology',
            icon: <GroupsIcon sx={{ fontSize: 48 }} />,
            color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
            features: ['User Profiles', 'Feed', 'Messaging'],
            downloads: '18.3k'
        }
    ];

    const filteredTemplates = templates.filter(template => {
        const matchesCategory = activeCategory === 0 || template.category === categories[activeCategory];
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <Box>
            <Box
                sx={{
                    pt: 12,
                    pb: 8,
                    background: 'radial-gradient(circle at 50% 0%, rgba(74, 158, 255, 0.1) 0%, #000 50%)',
                    position: 'relative'
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
                            Choose Your Template
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#999', maxWidth: 700, mx: 'auto', mb: 4 }}>
                            Start building with professionally designed templates. Customize everything to match your brand.
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            fullWidth
                            placeholder="Search templates..."
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

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                        <Tabs
                            value={activeCategory}
                            onChange={(e, newValue) => setActiveCategory(newValue)}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#4A9EFF',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                },
                                '& .MuiTab-root': {
                                    color: '#888',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    minWidth: 'auto',
                                    px: 3,
                                    '&.Mui-selected': {
                                        color: '#4A9EFF'
                                    }
                                }
                            }}
                        >
                            {categories.map((category, index) => (
                                <Tab key={index} label={category} />
                            ))}
                        </Tabs>
                    </Box>

                    <Grid container spacing={4}>
                        {filteredTemplates.map((template, index) => (
                            <Grid size={{xs:12, md:6, lg:4 }} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: 'rgba(74, 158, 255, 0.4)',
                                            boxShadow: '0 20px 40px rgba(74, 158, 255, 0.2)',
                                            '& .template-icon-box': {
                                                transform: 'scale(1.1)'
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        className="template-icon-box"
                                        sx={{
                                            height: 200,
                                            background: template.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'transform 0.4s',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0, 0, 0, 0.2)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', color: '#fff' }}>
                                            {template.icon}
                                        </Box>
                                    </Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                {template.name}
                                            </Typography>
                                            <Chip
                                                label={template.category}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(74, 158, 255, 0.2)',
                                                    color: '#4A9EFF',
                                                    fontWeight: 600,
                                                    border: '1px solid rgba(74, 158, 255, 0.3)'
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
                                            {template.downloads} downloads
                                        </Typography>
                                        <Box sx={{ mb: 3 }}>
                                            {template.features.map((feature, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={feature}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        color: '#ccc',
                                                        mr: 1,
                                                        mb: 1,
                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #3A8EEF 0%, #5B4FEF 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 24px rgba(74, 158, 255, 0.4)'
                                                    }
                                                }}
                                            >
                                                Use Template
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        borderColor: '#4A9EFF',
                                                        backgroundColor: 'rgba(74, 158, 255, 0.1)'
                                                    }
                                                }}
                                            >
                                                Preview
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {filteredTemplates.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
                                No templates found
                            </Typography>
                            <Typography sx={{ color: '#888' }}>
                                Try adjusting your search or category filter
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default TemplatesPage;