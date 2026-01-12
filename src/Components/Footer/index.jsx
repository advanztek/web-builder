import { Box, Container, Typography, Grid, IconButton, Divider, useTheme } from '@mui/material';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    LinkedIn, 
    YouTube,
    Email,
    Phone,
    LocationOn,
    ArrowUpward
} from '@mui/icons-material';

function Footer() {
    const theme = useTheme();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        resources: [
            { label: 'Documentation', href: '#' },
            { label: 'Tutorials', href: '#' },
            { label: 'Support Center', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'API Reference', href: '#' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Cookie Policy', href: '#' },
            { label: 'GDPR', href: '#' },
            { label: 'Licenses', href: '#' },
        ],
    };

    const socialLinks = [
        { icon: <Facebook />, href: '#', label: 'Facebook' },
        { icon: <Twitter />, href: '#', label: 'Twitter' },
        { icon: <Instagram />, href: '#', label: 'Instagram' },
        { icon: <LinkedIn />, href: '#', label: 'LinkedIn' },
        { icon: <YouTube />, href: '#', label: 'YouTube' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.mode === 'light' 
                    ? theme.palette.primary.main 
                    : theme.palette.primary.bg,
                color: theme.palette.primary.contrastText,
                position: 'relative',
                overflow: 'hidden',
            }}>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>               
                <Box
                    sx={{
                        py: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '12px',
                            color: theme.palette.mode === 'light'
                                ? 'rgba(255, 255, 255, 0.8)'
                                : theme.palette.text.secondary,
                        }}
                    >
                        © {new Date().getFullYear()} Web Builder. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;