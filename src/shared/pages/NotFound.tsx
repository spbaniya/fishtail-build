import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import SEO from '@/shared/components/ui/SEO';
import { QUICK_LINKS } from '@/shared/config/navigation';
import Icon from '@/shared/components/Icon';

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to a search page or community feed with the query
            navigate(`/community?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Map string icons to components
    const iconMap = {
        'Home': 'Home',
        'Users': 'Users',
        'Compass': 'Compass',
        'Calendar': 'Calendar',
        'FileText': 'FileText',
        'HelpCircle': 'HelpCircle',
    };

    const quickLinks = QUICK_LINKS.map(link => ({
        ...link,
        icon: iconMap[link.icon as keyof typeof iconMap] || 'Home'
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
            <SEO
                title="Page Not Found - ShareGarauna"
                description="The page you're looking for doesn't exist. Discover helpful resources and navigate back to our community platform."
                keywords={['404', 'page not found', 'error', 'community help', 'navigation']}
                url={location.pathname}
                noindex={true}
            />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Main Error Section */}
                    <div className="text-center mb-12">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-destructive/10 rounded-full mb-6">
                                <Icon name="HelpCircle" className="w-12 h-12 text-destructive" title="Help" ariaLabel="Help circle icon" />
                            </div>
                            <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">
                                Page Not Found
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                The page you're looking for seems to have wandered off into the digital wilderness.
                                Don't worry though – our community is here to help you find what you need!
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                onClick={() => navigate(-1)}
                                variant="outline"
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <Icon name="ArrowLeft" className="w-4 h-4" title="Back" ariaLabel="Arrow left icon" />
                                Go Back
                            </Button>
                            <Button
                                onClick={() => navigate("/")}
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <Icon name="Home" className="w-4 h-4" title="Home" ariaLabel="Home icon" />
                                Return Home
                            </Button>
                        </div>
                    </div>

                    {/* Search Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon name="Search" className="w-5 h-5" title="Search" ariaLabel="Search icon" />
                                Search Our Community
                            </CardTitle>
                            <CardDescription>
                                Can't find what you're looking for? Try searching our community resources.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Search for help, services, or information..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" className="flex items-center gap-2">
                                    <Icon name="Search" className="w-4 h-4" title="Search" ariaLabel="Search icon" />
                                    Search
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-center mb-6">
                            Popular Destinations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quickLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Card
                                        key={link.path}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => navigate(link.path)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-lg bg-muted`}>
                                                    <Icon name={link.icon} className={`w-5 h-5 ${link.color}`} title={link.title} ariaLabel={`${link.title} icon`} />
                                                </div>
                                                <h4 className="font-semibold">{link.title}</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {link.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Help Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon name="MessageSquare" className="w-5 h-5" title="Messages" ariaLabel="Message square icon" />
                                Need More Help?
                            </CardTitle>
                            <CardDescription>
                                If you're having trouble finding what you need, our community is always ready to help.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Quick Tips:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Check if the URL is spelled correctly</li>
                                        <li>• Try searching for similar content</li>
                                        <li>• Browse our community feed for related topics</li>
                                        <li>• Contact support if you need assistance</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Popular Sections:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/community")}>Community Help Requests</span></li>
                                        <li>• <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/service-discovery")}>Service Providers</span></li>
                                        <li>• <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/news-events")}>Community Events</span></li>
                                        <li>• <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate("/stories")}>Success Stories</span></li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Message */}
                    <div className="text-center mt-8 text-sm text-muted-foreground">
                        <p>
                            Lost? Our community is here to help you find your way.
                            <span
                                className="text-primary cursor-pointer hover:underline ml-1"
                                onClick={() => navigate("/")}
                            >
                                Let's get you back on track!
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
