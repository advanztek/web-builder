import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ROLE_MAP = {
    1: 'superadmin',
    2: 'admin',
    3: 'user',
};

const normalizeRole = (role) => {
    // If backend sends number or numeric string
    if (!isNaN(role)) {
        return ROLE_MAP[Number(role)];
    }

    // If backend sends string like "SUPER_ADMIN" or "super_admin"
    if (typeof role === 'string') {
        return role.toLowerCase().replace('_', '');
    }

    return undefined;
};

const ProtectedRoute = ({
    allowedRoles = [],
    children,
    redirectTo = '/dashboard',
}) => {
    const { user, loading, isAuthenticated } = useAuth();

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

    // Not logged in → login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const normalizedUserRole = normalizeRole(user?.role);
    const normalizedAllowedRoles = allowedRoles.map(r =>
        r.toLowerCase().replace('_', '')
    );

    console.log('Raw role:', user?.role);
    console.log('Normalized role:', normalizedUserRole);
    console.log('Allowed roles:', normalizedAllowedRoles);

    // Role check
    if (
        normalizedAllowedRoles.length > 0 &&
        !normalizedAllowedRoles.includes(normalizedUserRole)
    ) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
