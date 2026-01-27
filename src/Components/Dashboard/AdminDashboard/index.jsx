import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    CircularProgress,
    Button,
} from '@mui/material';
import {
    People,
    AccountBalanceWallet,
    Assignment,
    TrendingUp,
} from '@mui/icons-material';
// import { useGetAllUsers } from '../../hooks/useAdmin';

const AdminDashboard = () => {
    const theme = useTheme();
    // const { getAllUsers, users, loading } = useGetAllUsers();

    // useEffect(() => {
    //     getAllUsers();
    // }, []);

    // Calculate statistics
    // const totalUsers = users?.length || 0;
    // const totalProjects = users?.reduce((sum, user) => sum + (user.projectCount || 0), 0) || 0;
    // const totalCredits = users?.qreduce((sum, user) => sum + (user.credits || 0), 0) || 0;
    // const activeUsers = users?.filter((u) => u.status === 'active').length || 0;

    const statsCards = [
        {
            title: 'Total Users',
            // value: totalUsers,
            icon: <People sx={{ fontSize: 40 }} />,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
            title: 'Total Projects',
            // value: totalProjects,
            icon: <Assignment sx={{ fontSize: 40 }} />,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
            title: 'Total Credits',
            // value: totalCredits.toLocaleString(),
            icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
        },
        {
            title: 'Active Users',
            // value: activeUsers,
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
        },
    ];

    // Get top users by project count
    // const topUsers = [...(users || [])].sort((a, b) => (b.projectCount || 0) - (a.projectCount || 0)).slice(0, 5);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, pt: 12, px: 4, pb: 4 }}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography sx={{ color: '#94a3b8' }}>
                        Monitor and manage your platform
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statsCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 4px 12px ${stat.color}40`,
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <Box>
                                            <Typography sx={{ color: '#94a3b8', fontSize: 14, mb: 1 }}>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                bgcolor: stat.bgColor,
                                                color: stat.color,
                                                p: 1.5,
                                                borderRadius: 2,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Top Users Table */}
                <Card
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        mb: 4,
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                Top Users by Projects
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#3b82f6',
                                    borderColor: '#3b82f6',
                                    '&:hover': {
                                        borderColor: '#2563eb',
                                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                                    },
                                }}
                            >
                                View All Users
                            </Button>
                        </Box>

                        {/* {loading ? ( */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        // ) : (
                            <TableContainer component={Paper} sx={{ bgcolor: '#1a1f2e', borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#0f1419' }}>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Rank</TableCell>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>User</TableCell>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Projects</TableCell>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Credits</TableCell>
                                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        {/* )} */}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                                    Platform Overview
                                </Typography>
                                {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: '#94a3b8' }}>Average Projects per User:</Typography>
                                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                                            {totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: '#94a3b8' }}>Average Credits per User:</Typography>
                                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                                            {totalUsers > 0 ? (totalCredits / totalUsers).toFixed(0) : 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: '#94a3b8' }}>User Activation Rate:</Typography>
                                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                                            {totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0}%
                                        </Typography>
                                    </Box>
                                </Box> */}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                                    Quick Actions
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: '#3b82f6',
                                            borderColor: '#3b82f6',
                                            justifyContent: 'flex-start',
                                            '&:hover': {
                                                borderColor: '#2563eb',
                                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                            },
                                        }}
                                    >
                                        View All Users
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: '#10b981',
                                            borderColor: '#10b981',
                                            justifyContent: 'flex-start',
                                            '&:hover': {
                                                borderColor: '#059669',
                                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                            },
                                        }}
                                    >
                                        Manage Credit Packages
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            color: '#f59e0b',
                                            borderColor: '#f59e0b',
                                            justifyContent: 'flex-start',
                                            '&:hover': {
                                                borderColor: '#d97706',
                                                bgcolor: 'rgba(245, 158, 11, 0.1)',
                                            },
                                        }}
                                    >
                                        View Reports
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminDashboard;