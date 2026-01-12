// ContactPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    AccessTime as AccessTimeIcon,
    Send as SendIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon
} from '@mui/icons-material';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
    });

    const subjects = [
        'General Inquiry',
        'Technical Support',
        'Sales Question',
        'Partnership Opportunity',
        'Bug Report',
        'Feature Request'
    ];

    const contactInfo = [
        {
            icon: <EmailIcon sx={{ fontSize: 32 }} />,
            title: 'Email Us',
            content: 'support@webbuilder.com',
            subContent: 'We reply within 24 hours',
            color: '#4A9EFF'
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 32 }} />,
            title: 'Call Us',
            content: '+1 (555) 123-4567',
            subContent: 'Mon-Fri from 9am to 6pm',
            color: '#6B5FFF'
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
            title: 'Visit Us',
            content: 'San Francisco, CA',
            subContent: '123 Tech Street, 94102',
            color: '#F093FB'
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
            title: 'Working Hours',
            content: 'Monday - Friday',
            subContent: '9:00 AM - 6:00 PM PST',
            color: '#4FACFE'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <Box sx={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 12,
                    pb: 8,
                    background: 'radial-gradient(circle at 50% 0%, rgba(74, 158, 255, 0.1) 0%, #000 50%)',
                    position: 'relative'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                            Get in Touch
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#999', maxWidth: 700, mx: 'auto' }}>
                            Have a question or need help? We're here for you. Reach out and let's start a conversation.
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 8 }}>
                        {contactInfo.map((info, index) => (
                            <Grid size={{xs:12, sm:6, md:3 }} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '20px',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: `${info.color}40`,
                                            boxShadow: `0 12px 32px ${info.color}30`
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: '18px',
                                                background: `linear-gradient(135deg, ${info.color}20 0%, ${info.color}10 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                                color: info.color
                                            }}
                                        >
                                            {info.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                            {info.title}
                                        </Typography>
                                        <Typography sx={{ color: '#fff', mb: 0.5, fontWeight: 500 }}>
                                            {info.content}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            {info.subContent}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={4}>
                        {/* Contact Form */}
                        <Grid item xs={12} md={7}>
                            <Card
                                sx={{
                                    background: 'rgba(17, 17, 17, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '24px'
                                }}
                            >
                                <CardContent sx={{ p: 5 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                        Send us a Message
                                    </Typography>
                                    <Typography sx={{ color: '#888', mb: 4 }}>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </Typography>

                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Your Name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                                        '& .MuiInputLabel-root': {
                                                            color: '#888'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#4A9EFF'
                                                        },
                                                        '& input': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                                        '& .MuiInputLabel-root': {
                                                            color: '#888'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#4A9EFF'
                                                        },
                                                        '& input': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Company (Optional)"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                                        '& .MuiInputLabel-root': {
                                                            color: '#888'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#4A9EFF'
                                                        },
                                                        '& input': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                                        '& .MuiInputLabel-root': {
                                                            color: '#888'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#4A9EFF'
                                                        },
                                                        '& .MuiSelect-select': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                >
                                                    {subjects.map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    multiline
                                                    rows={6}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                                                        '& .MuiInputLabel-root': {
                                                            color: '#888'
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#4A9EFF'
                                                        },
                                                        '& textarea': {
                                                            color: '#fff'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    endIcon={<SendIcon />}
                                                    sx={{
                                                        py: 2,
                                                        background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                                        borderRadius: '12px',
                                                        fontWeight: 700,
                                                        fontSize: '1.1rem',
                                                        textTransform: 'none',
                                                        boxShadow: '0 8px 24px rgba(74, 158, 255, 0.4)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #3A8EEF 0%, #5B4FEF 100%)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 12px 32px rgba(74, 158, 255, 0.5)'
                                                        }
                                                    }}
                                                >
                                                    Send Message
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Additional Info and Social */}
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Map Card */}
                                <Card
                                    sx={{
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 250,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <LocationOnIcon sx={{ fontSize: 80, color: 'white', opacity: 0.3 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                position: 'absolute',
                                                fontWeight: 700,
                                                textAlign: 'center'
                                            }}
                                        >
                                            📍 Find Us Here
                                        </Typography>
                                    </Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                            Our Office
                                        </Typography>
                                        <Typography sx={{ color: '#aaa', mb: 2 }}>
                                            123 Tech Street, Suite 100<br />
                                            San Francisco, CA 94102<br />
                                            United States
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderColor: 'rgba(74, 158, 255, 0.5)',
                                                color: '#4A9EFF',
                                                borderRadius: '12px',
                                                py: 1.5,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    borderColor: '#4A9EFF',
                                                    backgroundColor: 'rgba(74, 158, 255, 0.1)'
                                                }
                                            }}
                                        >
                                            Get Directions
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Social Media Card */}
                                <Card
                                    sx={{
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px'
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                            Follow Us
                                        </Typography>
                                        <Typography sx={{ color: '#aaa', mb: 3 }}>
                                            Stay connected with us on social media for updates and news.
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                            {[
                                                { icon: <FacebookIcon />, color: '#1877F2' },
                                                { icon: <TwitterIcon />, color: '#1DA1F2' },
                                                { icon: <LinkedInIcon />, color: '#0A66C2' },
                                                { icon: <GitHubIcon />, color: '#fff' }
                                            ].map((social, index) => (
                                                <IconButton
                                                    key={index}
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: '14px',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        color: social.color,
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            backgroundColor: `${social.color}20`,
                                                            borderColor: social.color,
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: `0 8px 24px ${social.color}40`
                                                        }
                                                    }}
                                                >
                                                    {social.icon}
                                                </IconButton>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ContactPage;