
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/domains/auth/contexts/AuthContext';
import Icon from '@/shared/components/Icon';

const Footer = () => {
    const { register } = useAuth();
    return (
        <footer className="bg-surface border-t border-border">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="relative">
                                <div className="p-3 rounded-2xl bg-primary/10">
                                    <Icon name="Heart" className="h-7 w-7 text-primary" title="Heart" ariaLabel="Heart icon" />
                                    <Icon name="Users" className="h-3 w-3 text-secondary absolute -bottom-0.5 -right-0.5" title="Users" ariaLabel="Users icon" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground font-nunito">ShareGarauna</span>
                        </div>
                        <p className="text-foreground-muted mb-8 text-lg max-w-md leading-relaxed font-inter">
                            Connecting hearts and hands in our community. Where help finds hope,
                            and neighbors become family through acts of kindness.
                        </p>
                        <div className="flex items-center text-base text-foreground-muted font-inter">
                            <Icon name="MapPin" className="h-5 w-5 mr-3 text-primary" title="Location" ariaLabel="Location pin icon" />
                            Local Community Hub
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-6 font-raleway">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/community-feed" className="text-foreground-muted hover:text-primary transition-all duration-300 hover:translate-x-1 inline-flex items-center font-inter">
                                    Browse Requests
                                </Link>
                            </li>
                            <li>
                                <Link to="/stories" className="text-foreground-muted hover:text-primary transition-all duration-300 hover:translate-x-1 inline-flex items-center font-inter">
                                    Success Stories
                                </Link>
                            </li>
                            <li>
                                <Link to="/news-events" className="text-foreground-muted hover:text-primary transition-all duration-300 hover:translate-x-1 inline-flex items-center font-inter">
                                    News & Events
                                </Link>
                            </li>
                            <li>
                                <button onClick={register} className="text-foreground-muted hover:text-primary transition-all duration-300 hover:translate-x-1 inline-flex items-center font-inter">
                                    Join Community
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-6 font-raleway">Get in Touch</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start text-foreground-muted">
                                <Icon name="Mail" className="h-5 w-5 mr-3 mt-0.5 text-primary" title="Email" ariaLabel="Email icon" />
                                <span>contact@sharegarauna.com</span>
                            </li>
                            <li className="flex items-start text-foreground-muted">
                                <Icon name="Phone" className="h-5 w-5 mr-3 mt-0.5 text-primary" title="Phone" ariaLabel="Phone icon" />
                                <span className="text-base font-inter">+977 1-4597653-HELP</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-foreground-muted text-base font-inter">
                        © 2024 ShareGarauna. Made with ❤️ for our community.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mt-6 md:mt-0">
                        <Link to="/privacy-policy" className="text-foreground-muted hover:text-primary transition-all duration-300 font-inter">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="text-foreground-muted hover:text-primary transition-all duration-300 font-inter">
                            Terms of Service
                        </Link>
                        <Link to="/community-guidelines" className="text-foreground-muted hover:text-primary transition-all duration-300 font-inter">
                            Community Guidelines
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
