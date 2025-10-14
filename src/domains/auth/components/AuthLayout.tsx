import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;
