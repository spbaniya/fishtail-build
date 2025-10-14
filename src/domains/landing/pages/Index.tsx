import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
    ArrowRight,
    Users,
    Heart,
    Handshake,
    Star,
    MessageCircle,
    Calendar,
    CheckCircle,
    Globe,
    Shield,
    Plus,
    Sparkles,
    TrendingUp,
    MapPin,
    Mail,
    ChevronDown,
    Play,
    Award,
    Zap,
    BookOpen,
    Search,
    Filter,
    Newspaper,
    PartyPopper,
    Award as AwardIcon,
    Clock,
    TrendingUp as TrendingUpIcon
} from 'lucide-react';
import CreateRequestModal from '@/components/community/CreateRequestModal';
import { HelpRequestService } from '@/domains/help-seeker/services/helpRequestService';
import { HelpRequest } from '@/domains/help-seeker/types';
import { useToast } from '@/shared/hooks/use-toast';

export const Index = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Mock data for stats - in real app this would come from API
    const stats = [
        { id: 1, value: '10000', label: 'Active Members', icon: Users },
        { id: 2, value: '25000', label: 'Requests Completed', icon: Heart },
        { id: 3, value: '5000', label: 'Success Stories', icon: Handshake },
        { id: 4, value: '4.9', label: 'Average Rating', icon: Star }
    ];

    const features = [
        {
            id: 1,
            title: 'Request Help',
            description: 'Easily post your needs and get help from community members',
            icon: MessageCircle,
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop&crop=center',
            action: 'Create Request'
        },
        {
            id: 2,
            title: 'Offer Assistance',
            description: 'Share your skills and help others in your community',
            icon: Heart,
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=center',
            action: 'Browse Requests'
        },
        {
            id: 3,
            title: 'Build Connections',
            description: 'Create meaningful relationships with neighbors',
            icon: Calendar,
            image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop&crop=center',
            action: 'Join Community'
        }
    ];

    const testimonials = [
        {
            id: 1,
            quote: "CommunityHelp connected me with a neighbor who helped me move furniture when I couldn't do it myself. The kindness of strangers never ceases to amaze me!",
            author: "Sarah Johnson",
            location: "Kathmandu",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            rating: 5
        },
        {
            id: 2,
            quote: "I was able to help an elderly couple with their groceries during the pandemic. It felt great to give back to my community when they needed it most.",
            author: "Michael Chen",
            location: "Lalitpur",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            rating: 5
        },
        {
            id: 3,
            quote: "The tutoring feature helped my child excel in mathematics. Our community tutor was patient and knowledgeable.",
            author: "Priya Sharma",
            location: "Bhaktapur",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            rating: 5
        }
    ];

    useEffect(() => {
        loadRecentRequests();
        animateStats();
    }, []);

    const loadRecentRequests = async () => {
        setIsLoading(true);
        try {
            // Try to load from API first
            const requests = await HelpRequestService.getHelpRequests();
            setHelpRequests(requests.slice(0, 6)); // Get recent 6 requests
        } catch (error) {
            console.error('Error loading recent requests:', error);

            // Fallback to mock data if API fails
            const mockRequests: HelpRequest[] = [
                {
                    id: '1',
                    title: 'Need help moving furniture to new apartment',
                    description: 'Moving to a new place this weekend and need help carrying heavy furniture. Have a sofa, bed frame, and some boxes. Can offer Rs. 1000 for 2-3 hours of help.',
                    category: 'Household Chores',
                    location: 'Kathmandu',
                    urgent: false,
                    compensation_type: 'payment',
                    compensation_amount: 1000,
                    tags: ['moving', 'furniture', 'weekend'],
                    scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    seeker_id: 'user-1',
                    provider_count_needed: 2,
                    duration_days: 1,
                    verification_required: false
                },
                {
                    id: '2',
                    title: 'Elderly care - Need help with grocery shopping',
                    description: 'My elderly parents need regular help with grocery shopping and carrying heavy bags. Looking for someone reliable who can help 2-3 times a week.',
                    category: 'Errands',
                    location: 'Lalitpur',
                    urgent: false,
                    compensation_type: 'payment',
                    compensation_amount: 500,
                    tags: ['elderly-care', 'groceries', 'regular'],
                    scheduled_for: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    seeker_id: 'user-2',
                    provider_count_needed: 1,
                    duration_days: 30,
                    verification_required: true,
                    verification_types: ['police_report']
                },
                {
                    id: '3',
                    title: 'URGENT: Help with medical appointment transportation',
                    description: 'Need immediate help getting to hospital for medical appointment. Cannot drive due to recent surgery. Need someone with car.',
                    category: 'Medical Appointments',
                    location: 'Bhaktapur',
                    urgent: true,
                    compensation_type: 'payment',
                    compensation_amount: 800,
                    tags: ['medical', 'transportation', 'urgent'],
                    scheduled_for: new Date().toISOString(),
                    status: 'active',
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    seeker_id: 'user-3',
                    provider_count_needed: 1,
                    duration_days: 1,
                    verification_required: true,
                    verification_types: ['kyc', 'police_report']
                }
            ];

            setHelpRequests(mockRequests);
        } finally {
            setIsLoading(false);
        }
    };

    const animateStats = () => {
        const targetStats = stats.map(stat => parseInt(stat.value.replace(/,/g, '')));
        const steps = 50;
        const increment = targetStats.map(target => target / steps);

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setAnimatedStats(prev =>
                prev.map((val, idx) => Math.min(val + increment[idx], targetStats[idx]))
            );

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedStats(targetStats);
            }
        }, 50);

        return () => clearInterval(timer);
    };

    const handleCreateRequest = async (requestData: any) => {
        try {
            await HelpRequestService.createHelpRequest(requestData);
            setIsCreateModalOpen(false);
            toast({
                title: "Help request created successfully!",
                description: "Your request has been posted to the community.",
            });
            navigate('/seeker-dashboard');
        } catch (error) {
            console.error('Error creating request:', error);
            toast({
                title: "Error creating request",
                description: "Please try again later.",
                variant: "destructive",
            });
        }
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => {
                setIsSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full"></div>
                </div>

                <div className="relative container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                        <div className="space-y-10 animate-fade-in-up">
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full text-base font-medium text-primary font-raleway border border-primary/20 shadow-lg">
                                <Award className="h-5 w-5 mr-3 text-primary animate-pulse" />
                                🔥 Join 10,000+ Happy Members Today!
                                <Zap className="h-4 w-4 ml-3 text-secondary animate-pulse" />
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight font-nunito">
                                Connecting Hearts, <span className="text-primary">Building</span> Community
                            </h1>

                            <p className="text-xl text-foreground-muted leading-relaxed max-w-lg font-inter">
                                Connect with neighbors, request help, offer support, and create meaningful relationships that make your community thrive.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground text-lg px-9 py-5 h-auto rounded-2xl font-raleway transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:-translate-y-1 shadow-primary/50"
                                >
                                    <Plus className="mr-3 h-5 w-5" />
                                    Get Help Now - It's Free!
                                </Button>
                                <Link to="/community-feed">
                                    <Button variant="outline" className="text-lg px-9 py-5 h-auto border-2 rounded-2xl font-raleway transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1 shadow-primary/50">
                                        Browse Requests
                                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center space-x-8 pt-6">
                                <div className="flex items-center text-base text-foreground-muted font-inter bg-surface/90 px-4 py-2 rounded-full border border-border/30 shadow-lg backdrop-blur-sm">
                                    <Shield className="h-5 w-5 mr-3 text-success" />
                                    Verified Members
                                </div>
                                <div className="flex items-center text-base text-foreground-muted font-inter bg-surface/90 px-4 py-2 rounded-full border border-border/30 shadow-lg backdrop-blur-sm">
                                    <CheckCircle className="h-5 w-5 mr-3 text-success" />
                                    Safe & Secure
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop&crop=center"
                                            alt="Community helping"
                                            className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 border-4 border-surface"
                                        />
                                        <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                                            <Heart className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop&crop=center"
                                            alt="People collaborating"
                                            className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 border-4 border-surface"
                                        />
                                        <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg">
                                            <Users className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 pt-12">
                                    <div className="relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=200&fit=crop&crop=center"
                                            alt="Helping hands"
                                            className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-2 border-4 border-surface"
                                        />
                                        <div className="absolute -top-4 -left-4 bg-accent text-accent-foreground p-3 rounded-full shadow-lg">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop&crop=center"
                                            alt="Community event"
                                            className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:-rotate-2 border-4 border-surface"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gradient-to-br from-surface-elevated to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary/5 rounded-full"></div>
                </div>

                <div className="relative container mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-4xl font-bold text-foreground mb-5 font-nunito">Our Community Impact</h2>
                        <p className="text-xl text-foreground-muted max-w-3xl mx-auto font-inter">
                            Join thousands of community members helping each other every day
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={stat.id} className="text-center group relative">
                                <div className="absolute -inset-4 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-6 bg-background rounded-3xl group-hover:bg-surface transition-all duration-500 border-2 border-border group-hover:border-primary/30 shadow-xl group-hover:shadow-2xl">
                                    <div className="flex justify-center mb-6">
                                        <div className="p-6 bg-primary/10 rounded-3xl group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-xl border border-primary/20">
                                            <stat.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </div>
                                    <div className="text-5xl font-bold text-foreground mb-3 font-mono animate-pulse">
                                        {Math.floor(animatedStats[index]).toLocaleString()}
                                    </div>
                                    <div className="text-foreground-muted font-medium text-lg group-hover:text-primary transition-colors duration-300">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-gradient-to-br from-background to-secondary/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-40 h-40 bg-primary/5 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/5 rounded-full"></div>
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-nunito">How CommunityHelp Works</h2>
                        <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
                            Simple, safe, and effective way to connect with your community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={feature.id} className="group relative">
                                <div className="absolute -inset-4 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-background rounded-3xl border-2 border-border p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
                                    <div className="relative mb-8 overflow-hidden rounded-2xl">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
                                        <div className="absolute top-4 left-4 p-4 bg-surface/95 backdrop-blur-sm rounded-xl shadow-lg group-hover:bg-surface transition-all duration-300 border border-border/20">
                                            <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-bold text-sm">{index + 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                                        <p className="text-foreground-muted leading-relaxed">{feature.description}</p>
                                        <Link to="/community-feed" className="block">
                                            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                                {feature.action}
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Requests Section */}
            <section className="py-12 bg-surface">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recent Community Requests
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-nunito">
                            See What's <span className="text-primary">Happening</span> in Your Community
                        </h2>
                        <p className="text-foreground-muted max-w-3xl mx-auto text-lg leading-relaxed">
                            Real help requests from real people in your neighborhood
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="text-lg">Loading recent requests...</div>
                        </div>
                    ) : helpRequests.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {helpRequests.map((request) => (
                                <Card key={request.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-background">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge variant={request.urgent ? "destructive" : "secondary"} className="text-xs">
                                                {request.urgent ? 'Urgent' : 'Standard'}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {request.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{request.description}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {request.location}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {request.scheduled_for ? new Date(request.scheduled_for).toLocaleDateString() : 'Flexible'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No recent requests</h3>
                            <p className="text-muted-foreground">Be the first to create a help request in your community!</p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/community-feed">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                View All Requests
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 bg-gradient-to-br from-surface-elevated to-accent/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-48 h-48 bg-primary/5 rounded-full"></div>
                    <div className="absolute bottom-20 left-20 w-36 h-36 bg-secondary/5 rounded-full"></div>
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                            <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-nunito">What Our Community Says</h2>
                        <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
                            Real stories from real people making a difference
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={testimonial.id} className="bg-background rounded-3xl border-2 border-border p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 group relative">
                                <div className="absolute -inset-2 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative mb-6">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="flex justify-center mb-4 space-x-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-foreground italic mb-6 text-base leading-relaxed">"{testimonial.quote}"</p>
                                    <div>
                                        <div className="font-bold text-foreground">{testimonial.author}</div>
                                        <div className="text-sm text-foreground-muted">{testimonial.location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/5 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary-foreground/5 rounded-full"></div>
                </div>

                <div className="relative container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/10 rounded-full mb-8 shadow-xl">
                            <Mail className="h-10 w-10" />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-nunito">
                            Stay Connected
                        </h2>
                        <p className="text-xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
                            Get weekly updates on community activities and success stories
                        </p>

                        {!isSubscribed ? (
                            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="flex-1 px-6 py-4 rounded-2xl text-foreground font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300 hover:shadow-2xl"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                                    >
                                        Subscribe
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="max-w-md mx-auto">
                                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary-foreground" />
                                    <h3 className="text-2xl font-bold mb-2 text-primary-foreground">Thank You!</h3>
                                    <p className="text-primary-foreground/90">You'll receive our weekly community newsletter.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-br from-surface to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/5"></div>
                </div>

                <div className="relative container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full text-base font-medium text-primary mb-8 border border-primary/20 shadow-lg">
                            <Sparkles className="h-5 w-5 mr-3 text-primary" />
                            🚀 Join the Community Today!
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-8">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-nunito">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl text-foreground-muted mb-12 leading-relaxed max-w-3xl mx-auto">
                            Join thousands of community members helping each other every day
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/register">
                                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground text-lg px-10 py-4 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-primary/50">
                                    Join Our Community Today!
                                    <Heart className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                variant="outline"
                                className="text-lg px-10 py-4 h-auto border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground shadow-primary/50"
                            >
                                Create Help Request
                                <Plus className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Create Request Modal */}
            <CreateRequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRequest={handleCreateRequest}
            />
        </div>
    );
};
