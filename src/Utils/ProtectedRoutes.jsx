import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated, isSuperAdmin, isRegularUser } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: '#000',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (requiredRole) {
        if (requiredRole === 'super_admin' && !isSuperAdmin()) {
            // Redirect regular users trying to access admin routes
            return <Navigate to="/dashboard" replace />;
        }

        if (requiredRole === 'user' && !isRegularUser()) {
            // Redirect admins trying to access user-only routes (if any)
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;