import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
    allowedRoles?: ('user' | 'provider' | 'admin')[];
    requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles = [],
    requireAuth = true
}) => {
    const { isLoggedIn, user, isLoading, login } = useAuth();
    const location = useLocation();

    // Handle login redirect when authentication is required but user is not logged in
    useEffect(() => {
        if (requireAuth && !isLoggedIn && !isLoading) {
            alert('ProtectedRoute: Authentication required but user not logged in, redirecting to login...');
            login();
        }
    }, [requireAuth, isLoggedIn, isLoading, login]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If authentication is required but user is not logged in, show loading while redirecting
    if (requireAuth && !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Additional check: Ensure both isLoggedIn and !isLoading are true before allowing access
    if (!isLoggedIn || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If user is logged in but doesn't have required role
    if (isLoggedIn && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        switch (user.role) {
            case 'user':
            case 'provider':
            case 'admin':
                return <Navigate to="/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <><Outlet /></>;
};

export default ProtectedRoute;
