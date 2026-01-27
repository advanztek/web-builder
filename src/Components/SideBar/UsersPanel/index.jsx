import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
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
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Search, Visibility, Edit } from '@mui/icons-material';
// import { useGetAllUsers } from '../hooks/useAdmin';

export const UsersPanel = () => {
    const { getAllUsers, users, loading } = useGetAllUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (users) {
            const filtered = users.filter(
                (user) =>
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [users, searchQuery]);

    const handleViewUser = (userId) => {
        // Navigate to user details or open modal
        console.log('View user:', userId);
    };

    return (
        <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                All Users
            </Typography>

            <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        bgcolor: '#1a1f2e',
                        color: '#fff',
                        '& fieldset': { borderColor: '#2d3748' },
                        '&:hover fieldset': { borderColor: '#4a5568' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: '#64748b' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ bgcolor: '#1a1f2e', borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#0f1419' }}>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Role</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Projects</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Credits</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ color: '#64748b', py: 4 }}>
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#242938' },
                                            borderBottom: '1px solid #2d3748',
                                        }}
                                    >
                                        <TableCell sx={{ color: '#fff' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    sx={{ width: 36, height: 36, bgcolor: '#3b82f6' }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2">{user.name || 'N/A'}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role || 'user'}
                                                size="small"
                                                sx={{
                                                    bgcolor: user.role === 'super_admin' ? '#ef4444' : '#3b82f6',
                                                    color: '#fff',
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>
                                            {user.projectCount || 0}
                                        </TableCell>
                                        <TableCell sx={{ color: '#10b981', fontWeight: 600 }}>
                                            {user.credits || 0}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status || 'active'}
                                                size="small"
                                                sx={{
                                                    bgcolor: user.status === 'active' ? '#10b981' : '#64748b',
                                                    color: '#fff',
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewUser(user.id)}
                                                    sx={{ color: '#3b82f6' }}
                                                >
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: '#1a1f2e', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Total Users: <strong style={{ color: '#fff' }}>{filteredUsers.length}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                    Total Projects:{' '}
                    <strong style={{ color: '#fff' }}>
                        {filteredUsers.reduce((sum, user) => sum + (user.projectCount || 0), 0)}
                    </strong>
                </Typography>
            </Box>
        </Box>
    );
};