
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Menu, X, Heart, Users, User, Shield, Target, LogOut } from 'lucide-react';
import { ThemeSwitcher } from '@/shared/components/ui/theme-switcher';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/domains/auth/contexts/AuthContext';
import { navigationConfig, DASHBOARD_LINKS } from '@/shared/config/navigation';

const Header = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isLoggedIn, user, logout, login, register } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Extract public navigation from config
    const navigation = navigationConfig.user?.find(section => section.title === 'Community')?.items.map(item => ({
        name: item.name,
        href: item.href
    })) || [
            { name: t('header.home'), href: '/' },
            { name: t('header.communityFeed'), href: '/community-feed' },
            { name: t('header.stories'), href: '/stories' },
            { name: t('header.groups'), href: '/groups' },
            { name: t('header.newsEvents'), href: '/news-events' },
        ];

    // Map string icons to components
    const iconMap = {
        'User': User,
        'Target': Target,
    };

    const dashboardLinks = DASHBOARD_LINKS.map(link => ({
        ...link,
        icon: iconMap[link.icon as keyof typeof iconMap] || User
    }));

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className={`sticky top-0 z-50 bg-surface-elevated/95 backdrop-blur-sm ${isScrolled ? 'border-b border-border' : ''} shadow-sm`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="p-2 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                                <Heart className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-30" />
                                <Users className="h-3 w-3 text-secondary absolute -bottom-0.5 -right-0.5" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-foreground font-nunito tracking-tight">ShareGarauna</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`relative px-2 py-3 text-base font-medium transition-all duration-300 font-raleway ${isActive(item.href)
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-foreground-muted hover:text-foreground border-b-2 border-transparent hover:border-border'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <LanguageSwitcher />
                        <ThemeSwitcher />

                        {isLoggedIn ? (
                            <>
                                {/* Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="font-raleway rounded-2xl px-5 py-5">
                                            <User className="h-5 w-5 mr-2" />
                                            {user?.firstName || t('header.profile')}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-72 bg-surface border-border shadow-community rounded-3xl p-2">
                                        {dashboardLinks.map((item) => (
                                            <DropdownMenuItem key={item.name} asChild className="p-0 rounded-2xl mb-1">
                                                <Link
                                                    to={item.href}
                                                    className="flex items-center gap-4 px-5 py-4 hover:bg-surface-elevated rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                                >
                                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                                        <item.icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground font-raleway text-base">{item.name}</div>
                                                        <div className="text-sm text-foreground-muted font-inter mt-1">{item.description}</div>
                                                    </div>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuItem asChild className="p-0 rounded-2xl mb-1">
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-elevated rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <div className="p-3 bg-accent/10 rounded-2xl">
                                                    <Target className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground font-raleway text-base">Dashboard</div>
                                                    <div className="text-sm text-foreground-muted font-inter mt-1">View your account overview</div>
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-border my-2" />
                                        <DropdownMenuItem asChild className="p-0 rounded-2xl">
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-elevated rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <div className="p-3 bg-accent/10 rounded-2xl">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground font-raleway text-base">{t('header.settings')}</div>
                                                    <div className="text-sm text-foreground-muted font-inter mt-1">{t('header.accountPreferences')}</div>
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="p-0 rounded-2xl">
                                            <Link
                                                to="/logout"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    logout();
                                                }}
                                                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-elevated rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <div className="p-3 bg-accent/10 rounded-2xl">
                                                    <LogOut className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground font-raleway text-base">{t('header.logOut')}</div>
                                                    <div className="text-sm text-foreground-muted font-inter mt-1">{t('header.signOutDesc')}</div>
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" className="font-raleway rounded-2xl px-5" onClick={login}>
                                    {t('header.signIn')}
                                </Button>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-5 font-raleway transition-all duration-300 hover:scale-105" onClick={register}>
                                    {t('header.joinCommunity')}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 rounded-2xl hover:bg-surface transition-all duration-30"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6 text-foreground" />
                            ) : (
                                <Menu className="h-6 w-6 text-foreground" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-6 border-t border-border animate-fade-in-up">
                        <nav className="flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`relative px-2 py-3 text-base font-medium transition-all duration-300 font-raleway border-b-2 ${isActive(item.href)
                                        ? 'text-primary border-primary'
                                        : 'text-foreground-muted hover:text-foreground border-transparent hover:border-border'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-border">
                                <div className="text-base font-semibold text-foreground mb-3 font-raleway px-5">{t('header.dashboards')}</div>
                                {dashboardLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-surface-elevated transition-all duration-300"
                                    >
                                        <div className="p-3 bg-primary/10 rounded-2xl">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground font-raleway text-base">{item.name}</div>
                                            <div className="text-sm text-foreground-muted font-inter mt-1">{item.description}</div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-surface-elevated transition-all duration-300"
                                >
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <Target className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground font-raleway text-base">Dashboard</div>
                                        <div className="text-sm text-foreground-muted font-inter mt-1">View your account overview</div>
                                    </div>
                                </Link>
                                <div className="mt-6 pt-6 border-t border-border space-y-3">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                                                <Button variant="outline" className="w-full font-raleway rounded-2xl py-6 text-base">
                                                    {t('header.settings')}
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => {
                                                    logout();
                                                    setIsMenuOpen(false);
                                                }}
                                                variant="outline"
                                                className="w-full font-raleway rounded-2xl py-6 text-base"
                                            >
                                                {t('header.logOut')}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="w-full font-raleway rounded-2xl py-6 text-base" onClick={login}>
                                                {t('header.signIn')}
                                            </Button>
                                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-2xl py-6 font-raleway transition-all duration-300" onClick={register}>
                                                {t('header.joinCommunity')}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
