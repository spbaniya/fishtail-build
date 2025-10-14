import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-4'
    };

    return (
        <div
            className={`animate-spin rounded-full border-solid border-t-transparent ${sizeClasses[size]} ${className}`}
            style={{
                borderColor: 'hsl(var(--primary))',
                borderTopColor: 'transparent'
            }}
        />
    );
};

export default LoadingSpinner;
