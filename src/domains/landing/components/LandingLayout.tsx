import React from 'react';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';

interface LandingLayoutProps {
    children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default LandingLayout;
