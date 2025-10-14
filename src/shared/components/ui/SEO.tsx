import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_SEO_KEYWORDS } from '@/shared/utils/uiConstantsService';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile' | 'book' | 'video' | 'music' | 'product';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    canonical?: string;
    noindex?: boolean;
    structuredData?: object;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    locale?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    canonical,
    noindex = false,
    structuredData,
    twitterCard = 'summary_large_image',
    locale = 'en_US'
}) => {
    // Default values
    const siteName = 'ShareGarauna - Connecting Hearts, Building Community';
    const defaultDescription = 'Connect with neighbors, request help, offer support, and create meaningful relationships that make your community thrive. Join thousands of community members helping each other.';
    const defaultImage = '/placeholder.svg';
    const baseUrl = window.location.origin;

    // Construct full title
    const fullTitle = title ? `${title} | ${siteName}` : siteName;

    // Construct full description
    const fullDescription = description || defaultDescription;

    // Construct full image URL
    const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}${defaultImage}`;

    // Construct canonical URL
    const canonicalUrl = canonical || url || window.location.href;

    // Combine all keywords
    const allKeywords = [
        ...DEFAULT_SEO_KEYWORDS,
        ...keywords,
        ...tags
    ].filter((keyword, index, arr) => arr.indexOf(keyword) === index); // Remove duplicates

    // Generate structured data for the page
    const generateStructuredData = () => {
        const baseData: any = {
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebPage',
            name: fullTitle,
            description: fullDescription,
            url: canonicalUrl,
            image: fullImage,
            publisher: {
                '@type': 'Organization',
                name: siteName,
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/favicon.ico`
                }
            }
        };

        if (type === 'article' && (author || publishedTime)) {
            baseData['@type'] = 'Article';
            if (author) {
                baseData.author = {
                    '@type': 'Person',
                    name: author
                };
            }
            if (publishedTime) {
                baseData.datePublished = publishedTime;
            }
            if (modifiedTime) {
                baseData.dateModified = modifiedTime;
            }
            if (section) {
                baseData.articleSection = section;
            }
            if (tags.length > 0) {
                baseData.keywords = tags.join(', ');
            }
        }

        // Organization structured data
        const organizationData = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteName,
            url: baseUrl,
            logo: `${baseUrl}/favicon.ico`,
            description: defaultDescription,
            sameAs: [
                // Add social media URLs if available
            ]
        };

        return [baseData, organizationData, ...(structuredData ? [structuredData] : [])];
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="keywords" content={allKeywords.join(', ')} />
            <meta name="author" content={author || siteName} />

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            )}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />

            {/* Open Graph Article Tags */}
            {type === 'article' && author && <meta property="article:author" content={author} />}
            {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {type === 'article' && section && <meta property="article:section" content={section} />}
            {type === 'article' && tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={fullImage} />
            {author && <meta name="twitter:creator" content={author} />}

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#3b82f6" />
            <meta name="msapplication-TileColor" content="#3b82f6" />
            <meta name="application-name" content={siteName} />

            {/* Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="format-detection" content="telephone=no" />

            {/* Structured Data */}
            {generateStructuredData().map((data, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ))}

            {/* Favicon and Icons */}
            <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.ico" />

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="//images.unsplash.com" />
        </Helmet>
    );
};

export default SEO;
