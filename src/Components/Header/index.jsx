import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, AppBar, Toolbar, IconButton, useTheme } from '@mui/material';
import { PlayArrow, Menu } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Book20Regular,
    ContactCard20Regular,
} from "@fluentui/react-icons";


function Header() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Check if current page is homepage
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Only run slideshow on homepage
        if (!isHomePage) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, [isHomePage]);

    const slides = [
        {
            title: "Building apps just got easier",
            description: "Aliquam vel platea curabitur sit vestibulum egestas sit id lorem. Aliquet neque, dui sed eget scelerisque. Non at at venenatis tortor amet feugiat ullamcorper in. Odio vulputate eros vel lacinia turpis volutpat adipiscing. Sollicitudin at velit, blandit tempus nunc in."
        },
        {
            title: "Create powerful solutions faster",
            description: "Transform your ideas into reality with our intuitive platform. Build, deploy, and scale applications with ease using modern tools and best practices."
        },
        {
            title: "Innovation at your fingertips",
            description: "Leverage cutting-edge technology to bring your vision to life. Our platform empowers developers to create exceptional experiences effortlessly."
        }
    ];

    const navItems = [
        { label: 'Documentation', link: '/documentation' },
    ];

    const handleGetStarted = () => {
        navigate('/login');
    }
    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: scrolled
                        ? theme.palette.background.glass
                        : 'transparent',
                    // backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease-in-out',
                    borderRadius: 0,
                    boxShadow: 0
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Typography
                            variant='h3'
                            sx={{
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, #ff6b9d 0%, #feca57 50%, #48dbfb 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                lineHeight: 1.2,
                            }}
                        >
                            Web Builder
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                    gap: 4,
                                }}
                            >
                                {navItems.map((item) => {
                                    const icon =
                                        item.label === "Documentation" ? (
                                            <Book20Regular />
                                        ) : item.label === "Contact" ? (
                                            <ContactCard20Regular />
                                        ) : null;

                                    return (
                                        <Box
                                            key={item.label}
                                            onClick={() => navigate(item.link)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: icon ? 1 : 0,
                                                color: scrolled ? theme.palette.text.small : "#fff",
                                                fontSize: "15px",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                transition: "color 0.2s",
                                                "&:hover": {
                                                    color: theme.palette.primary.main,
                                                },
                                                "& svg": {
                                                    fontSize: "18px",
                                                },
                                            }}
                                        >
                                            {icon}
                                            <Typography component="span" sx={{ fontSize: "15px", fontWeight: 500 }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Button
                                variant="outlined"
                                onClick={handleGetStarted}
                                sx={{
                                    textTransform: "none",
                                    px: 2,
                                    py: 0.7,
                                    borderRadius: "50px",
                                    borderColor: theme.palette.divider,
                                    color: theme.palette.text.secondary,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                🚀 Get Started
                            </Button>

                            <IconButton sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Menu />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default Header;