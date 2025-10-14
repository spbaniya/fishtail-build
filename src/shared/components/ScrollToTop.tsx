import { useEffect } from 'react';

const ScrollToTop = () => {
    useEffect(() => {
        // Function to scroll to top
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        };

        // Listen for navigation events
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if the clicked element is a link or button that might navigate
            const linkElement = target.closest('a[href], button[onclick], [data-navigate]');

            if (linkElement) {
                // Small delay to allow navigation to complete
                setTimeout(scrollToTop, 100);
            }
        };

        // Listen for popstate events (browser back/forward buttons)
        const handlePopState = () => {
            scrollToTop();
        };

        // Listen for hash changes
        const handleHashChange = () => {
            scrollToTop();
        };

        // Add event listeners
        document.addEventListener('click', handleClick);
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup
        return () => {
            document.removeEventListener('click', handleClick);
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return null;
};

export default ScrollToTop;
