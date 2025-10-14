import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/contexts/AuthContext';
import { getNavigationForRole } from '@/shared/config/navigation';
import Icon from '@/shared/components/Icon';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { ThemeSwitcher } from '@/shared/components/ui/theme-switcher';
import UserDropdown from '@/shared/components/ui/user-dropdown';
import {
    Shield,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Bell,
    Search,
    AlertTriangle,
    Activity,
    Database,
    Users,
    ExternalLink
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set([2, 3, 4])); // Collapse Provider Panel, Community, and Management by default

    const navigationSections = getNavigationForRole(user?.role || 'admin');
    const isActive = (path: string) => location.pathname === path;

    const toggleSection = (sectionIndex: number) => {
        const newCollapsedSections = new Set(collapsedSections);
        if (newCollapsedSections.has(sectionIndex)) {
            newCollapsedSections.delete(sectionIndex);
        } else {
            newCollapsedSections.add(sectionIndex);
        }
        setCollapsedSections(newCollapsedSections);
    };

    const getIcon = (iconName: string) => {
        return <Icon name={iconName} className="h-5 w-5" title={iconName} ariaLabel={iconName} />;
    };


    const systemStats = [
        { label: 'Active Users', value: '1,247', icon: Users, color: 'text-blue-500' },
        { label: 'Total Services', value: '89', icon: Database, color: 'text-green-500' },
        { label: 'System Health', value: '98%', icon: Activity, color: 'text-emerald-500' },
        { label: 'Reports Today', value: '23', icon: AlertTriangle, color: 'text-orange-500' },
    ];

    // Scroll indicator logic
    const updateScrollIndicators = (scrollContainer: HTMLElement | null) => {
        if (!scrollContainer) return;

        const topIndicator = document.getElementById('scroll-top-indicator-admin');
        const bottomIndicator = document.getElementById('scroll-bottom-indicator-admin');

        if (topIndicator && bottomIndicator) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            const hasContentAbove = scrollTop > 10;
            const hasContentBelow = scrollTop + clientHeight < scrollHeight - 10;

            topIndicator.style.opacity = hasContentAbove ? '1' : '0';
            bottomIndicator.style.opacity = hasContentBelow ? '1' : '0';

            // Debug logging (remove in production)
            console.log('AdminLayout Scroll:', { scrollTop, scrollHeight, clientHeight, hasContentAbove, hasContentBelow });
        }
    };

    React.useEffect(() => {
        const scrollContainer = document.querySelector('.admin-sidebar-scroll') as HTMLElement;
        if (scrollContainer) {
            updateScrollIndicators(scrollContainer);
            scrollContainer.addEventListener('scroll', () => updateScrollIndicators(scrollContainer));
            return () => scrollContainer.removeEventListener('scroll', () => updateScrollIndicators(scrollContainer));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex">
            {/* Enhanced Sidebar */}
            <aside className={`bg-surface-elevated border-r border-border flex flex-col max-h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'
                } relative`}>
                {/* Sidebar Header - Fixed */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Shield className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground font-raleway">Admin Control</h2>
                                    <p className="text-xs text-foreground-muted">System Management</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 h-8 w-8"
                        >
                            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto relative admin-sidebar-scroll">

                    {/* Navigation */}
                    <nav className="p-4">
                        {navigationSections.map((section, sectionIndex) => {
                            const isCollapsed = collapsedSections.has(sectionIndex);
                            return (
                                <div key={sectionIndex}>
                                    {!sidebarCollapsed && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleSection(sectionIndex)}
                                            className="w-full flex items-center justify-between p-2 hover:bg-surface rounded-md"
                                        >
                                            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider font-raleway">
                                                {section.title}
                                            </h3>
                                            {isCollapsed ? (
                                                <ChevronRight className="h-3 w-3 text-foreground-muted" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 text-foreground-muted" />
                                            )}
                                        </Button>
                                    )}
                                    {!isCollapsed && (
                                        <ul className="space-y-1">
                                            {section.items.map((item) => {
                                                const isExternal = item.target === '_blank';
                                                const linkClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(item.href)
                                                    ? 'bg-red-500 text-white shadow-sm'
                                                    : 'text-foreground-muted hover:text-foreground hover:bg-surface'
                                                    } ${sidebarCollapsed ? 'justify-center' : ''}`;

                                                return (
                                                    <li key={item.name}>
                                                        {isExternal ? (
                                                            <a
                                                                href={item.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={linkClass}
                                                                title={sidebarCollapsed ? item.name : undefined}
                                                            >
                                                                <div className={`flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-foreground-muted group-hover:text-foreground'}`}>
                                                                    {getIcon(item.icon)}
                                                                </div>
                                                                {!sidebarCollapsed && (
                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                        <span className="truncate">{item.name}</span>
                                                                        <ExternalLink className={`h-3 w-3 flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-foreground-muted group-hover:text-foreground'}`} />
                                                                    </div>
                                                                )}
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                to={item.href}
                                                                className={linkClass}
                                                                title={sidebarCollapsed ? item.name : undefined}
                                                            >
                                                                <div className={`flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-foreground-muted group-hover:text-foreground'}`}>
                                                                    {getIcon(item.icon)}
                                                                </div>
                                                                {!sidebarCollapsed && (
                                                                    <span className="truncate">{item.name}</span>
                                                                )}
                                                            </Link>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                    {sectionIndex < navigationSections.length - 1 && !sidebarCollapsed && (
                                        <Separator className="my-2 bg-border/50" />
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* User Dropdown - Fixed at bottom */}
                <div className="border-t border-border flex-shrink-0 py-1">
                    <UserDropdown collapsed={sidebarCollapsed} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col max-h-screen">
                {/* Top Bar */}
                <header className="bg-surface-elevated/50 border-b border-border px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground font-raleway">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-foreground-muted mt-1">
                                Monitor and manage the entire platform
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Search className="h-4 w-4" />
                                Search
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Bell className="h-4 w-4" />
                                Alerts
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Emergency
                            </Button>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
