import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const ImageWithFallback = React.forwardRef<HTMLImageElement, ImageWithFallbackProps>(
    ({ src, fallbackSrc = '/placeholder.svg', alt, ...props }, ref) => {
        const [imgSrc, setImgSrc] = useState(src);
        const [hasError, setHasError] = useState(false);

        const handleError = () => {
            if (!hasError) {
                setHasError(true);
                setImgSrc(fallbackSrc);
            }
        };

        const handleLoad = () => {
            // Reset error state if image loads successfully
            setHasError(false);
        };

        // If src is empty or undefined, use fallback immediately
        const finalSrc = !src || src.trim() === '' ? fallbackSrc : imgSrc;

        return (
            <img
                ref={ref}
                src={finalSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
            />
        );
    }
);

ImageWithFallback.displayName = 'ImageWithFallback';

export { ImageWithFallback };
