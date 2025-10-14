import React from 'react';
import { useAuth } from '@/domains/auth/contexts/AuthContext';
import LandingLayout from '@/domains/landing/components/LandingLayout';
import AuthLayout from '@/domains/auth/components/AuthLayout';
import UserLayout from '@/domains/user/components/UserLayout';
import AdminLayout from '@/domains/admin/components/AdminLayout';
import { Outlet } from 'react-router-dom';

interface LayoutWrapperProps {
    isPublic?: boolean;
    isAuth?: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ isPublic = false, isAuth = false }) => {
    const { isLoggedIn, user } = useAuth();

    // For auth pages (login, register, forgot-password), use AuthLayout
    if (isAuth) {
        return <AuthLayout><Outlet /></AuthLayout>;
    }

    // For public pages, always use LandingLayout
    if (isPublic || !isLoggedIn) {
        return <LandingLayout><Outlet /></LandingLayout>;
    }

    // For authenticated users, use role-based layout
    switch (user?.role) {
        case 'admin':
            return <AdminLayout><Outlet /></AdminLayout>;
        case 'user':
        default:
            return <UserLayout><Outlet /></UserLayout>;
    }
};

export default LayoutWrapper;
