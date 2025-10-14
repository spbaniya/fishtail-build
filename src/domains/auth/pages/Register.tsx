import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';

const Register: React.FC = () => {
    const { register } = useAuth();

    useEffect(() => {
        // Immediately redirect to backend register
        register();
    }, [register]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Redirecting to registration...</p>
            </div>
        </div>
    );
};

export default Register;
