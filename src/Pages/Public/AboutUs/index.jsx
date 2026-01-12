// AboutPage.jsx
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    Chip
} from '@mui/material';
import {
    Rocket as RocketIcon,
    Lightbulb as LightbulbIcon,
    People as PeopleIcon,
    EmojiEvents as TrophyIcon,
    TrendingUp as GrowthIcon,
    Language as GlobalIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';

const AboutPage = () => {
    const stats = [
        { number: '10K+', label: 'Active Users', icon: <PeopleIcon /> },
        { number: '50K+', label: 'Projects Built', icon: <RocketIcon /> },
        { number: '150+', label: 'Countries', icon: <GlobalIcon /> },
        { number: '99.9%', label: 'Uptime', icon: <TrophyIcon /> }
    ];

    const values = [
        {
            icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
            title: 'Innovation First',
            description: 'We constantly push boundaries to deliver cutting-edge solutions that empower developers.',
            color: '#FFD93D'
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: 'User-Centric',
            description: 'Every feature we build starts with understanding and solving real user problems.',
            color: '#6BCF7F'
        },
        {
            icon: <TrophyIcon sx={{ fontSize: 40 }} />,
            title: 'Excellence',
            description: 'We maintain the highest standards in code quality, performance, and user experience.',
            color: '#4A9EFF'
        },
        {
            icon: <GrowthIcon sx={{ fontSize: 40 }} />,
            title: 'Continuous Growth',
            description: 'We believe in constant learning and improvement, both for our team and our users.',
            color: '#F093FB'
        }
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Co-Founder',
            image: 'SJ',
            bio: 'Former tech lead at major SaaS companies',
            color: '#4A9EFF'
        },
        {
            name: 'Michael Chen',
            role: 'CTO & Co-Founder',
            image: 'MC',
            bio: 'Serial entrepreneur with 15+ years in dev tools',
            color: '#6B5FFF'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Design',
            image: 'ER',
            bio: 'Award-winning designer from Silicon Valley',
            color: '#F093FB'
        },
        {
            name: 'David Kim',
            role: 'VP of Engineering',
            image: 'DK',
            bio: 'Built scalable systems for millions of users',
            color: '#4FACFE'
        }
    ];

    const milestones = [
        { year: '2020', event: 'Company Founded', description: 'Started with a vision to democratize web development' },
        { year: '2021', event: 'Series A Funding', description: 'Raised $10M to expand our platform' },
        { year: '2022', event: '5K Users', description: 'Reached our first major user milestone' },
        { year: '2023', event: 'AI Features Launch', description: 'Introduced AI-powered development tools' },
        { year: '2024', event: '10K+ Users', description: 'Growing community of developers worldwide' }
    ];

    const skills = [
        { name: 'Frontend Development', value: 95 },
        { name: 'Backend Infrastructure', value: 90 },
        { name: 'Cloud Architecture', value: 88 },
        { name: 'AI/ML Integration', value: 85 },
        { name: 'DevOps & Security', value: 92 }
    ];

    return (
        <Box>
            <Box
                sx={{
                    pt: 12,
                    pb: 8,
                    background: 'radial-gradient(circle at 50% 0%, rgba(74, 158, 255, 0.15) 0%, #000 50%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#4A9EFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                mb: 2,
                                display: 'block'
                            }}
                        >
                            ABOUT US
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Building the Future of Web Development
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#999',
                                maxWidth: 800,
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontWeight: 400
                            }}
                        >
                            We're on a mission to empower developers and creators worldwide with intuitive tools
                            that make building powerful web applications accessible to everyone.
                        </Typography>
                    </Box>

                    {/* Stats Grid */}
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '20px',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: 'rgba(74, 158, 255, 0.4)',
                                            boxShadow: '0 12px 32px rgba(74, 158, 255, 0.2)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                color: '#4A9EFF',
                                                mb: 2,
                                                '& svg': {
                                                    fontSize: 40
                                                }
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 1,
                                                background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography sx={{ color: '#aaa', fontWeight: 500 }}>
                                            {stat.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Our Story Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#4A9EFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                mb: 2,
                                display: 'block'
                            }}
                        >
                            OUR STORY
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                            From Vision to Reality
                        </Typography>
                        <Typography sx={{ color: '#aaa', lineHeight: 1.8, mb: 3 }}>
                            Web Builder was born from a simple observation: building web applications
                            shouldn't require years of experience or massive development teams. We saw
                            talented designers, entrepreneurs, and creators held back by technical barriers.
                        </Typography>
                        <Typography sx={{ color: '#aaa', lineHeight: 1.8, mb: 3 }}>
                            In 2020, our founders came together with a shared vision to democratize web
                            development. We combined cutting-edge technology with intuitive design to create
                            a platform that empowers anyone to build professional web applications.
                        </Typography>
                        <Typography sx={{ color: '#aaa', lineHeight: 1.8 }}>
                            Today, we're proud to serve over 10,000 users across 150 countries, helping them
                            bring their ideas to life faster than ever before.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '24px',
                                p: 6,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0, 0, 0, 0.3)'
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                {milestones.map((milestone, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 4,
                                            '&:last-child': { mb: 0 }
                                        }}
                                    >
                                        <Chip
                                            label={milestone.year}
                                            sx={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                color: '#fff',
                                                fontWeight: 700,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            {milestone.event}
                                        </Typography>
                                        <Typography sx={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                            {milestone.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Values Section */}
            <Box sx={{ py: 12, backgroundColor: '#050505' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#4A9EFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                mb: 2,
                                display: 'block'
                            }}
                        >
                            OUR VALUES
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                            What Drives Us
                        </Typography>
                        <Typography sx={{ color: '#999', maxWidth: 600, mx: 'auto' }}>
                            These core principles guide everything we do and shape the culture we're building
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {values.map((value, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: `${value.color}40`,
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: '18px',
                                                background: `${value.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: value.color,
                                                mb: 3
                                            }}
                                        >
                                            {value.icon}
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                            {value.title}
                                        </Typography>
                                        <Typography sx={{ color: '#aaa', lineHeight: 1.7 }}>
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Team Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#4A9EFF',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            mb: 2,
                            display: 'block'
                        }}
                    >
                        OUR TEAM
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                        Meet the People Behind Web Builder
                    </Typography>
                    <Typography sx={{ color: '#999', maxWidth: 600, mx: 'auto' }}>
                        A diverse team of passionate individuals dedicated to building the future of web development
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {team.map((member, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    background: 'rgba(17, 17, 17, 0.6)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        borderColor: `${member.color}40`,
                                        '& .member-avatar': {
                                            transform: 'scale(1.1)'
                                        }
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar
                                        className="member-avatar"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mx: 'auto',
                                            mb: 2,
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${member.color} 0%, ${member.color}CC 100%)`,
                                            transition: 'transform 0.3s'
                                        }}
                                    >
                                        {member.image}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {member.name}
                                    </Typography>
                                    <Typography sx={{ color: member.color, fontWeight: 600, mb: 2, fontSize: '0.95rem' }}>
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        {member.bio}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Skills Section */}
            <Box sx={{ py: 12, backgroundColor: '#050505' }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                            Our Expertise
                        </Typography>
                        <Typography sx={{ color: '#999' }}>
                            Technical capabilities that power our platform
                        </Typography>
                    </Box>

                    <Box>
                        {skills.map((skill, index) => (
                            <Box key={index} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography sx={{ fontWeight: 600 }}>{skill.name}</Typography>
                                    <Typography sx={{ color: '#4A9EFF', fontWeight: 700 }}>{skill.value}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={skill.value}
                                    sx={{
                                        height: 10,
                                        borderRadius: '10px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(90deg, #4A9EFF 0%, #6B5FFF 100%)',
                                            borderRadius: '10px'
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
                <Box
                    sx={{
                        p: 6,
                        background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(107, 95, 255, 0.1) 100%)',
                        borderRadius: '32px',
                        border: '1px solid rgba(74, 158, 255, 0.2)'
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                        Join Our Journey
                    </Typography>
                    <Typography sx={{ color: '#aaa', mb: 4, fontSize: '1.1rem' }}>
                        Be part of a revolution in web development. Start building today.
                    </Typography>
                    <button
                        style={{
                            padding: '16px 48px',
                            background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                            border: 'none',
                            borderRadius: '16px',
                            color: '#fff',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 12px 32px rgba(74, 158, 255, 0.4)',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-4px)';
                            e.target.style.boxShadow = '0 16px 40px rgba(74, 158, 255, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 12px 32px rgba(74, 158, 255, 0.4)';
                        }}
                    >
                        Get Started Free
                    </button>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutPage;