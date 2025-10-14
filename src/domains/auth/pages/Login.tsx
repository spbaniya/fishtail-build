import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';

const Login: React.FC = () => {
    const { login } = useAuth();

    useEffect(() => {
        // Immediately redirect to backend login
        login();
    }, [login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
            </div>
        </div>
    );
};

export default Login;
