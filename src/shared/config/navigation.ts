export interface NavItem {
    name: string;
    href: string;
    icon: string; // Icon name as string
    allowedRoles: ('user' | 'provider' | 'admin' | 'authority')[];
    description?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

const dashboardMenu: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: 'User', allowedRoles: ['user', 'provider', 'admin'], description: 'Manage your requests' },
        ]
    }
]

const providerDashboardMenu: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: 'User', allowedRoles: ['user', 'provider', 'admin'], description: 'Manage your requests' },
        ]
    }
]

const adminDashboardMenu: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: 'Shield', allowedRoles: ['admin'], description: 'Admin overview' },
        ]
    }
]

const kycMenu: NavSection = {
    title: 'KYC',
    items: [
        { name: 'KYC Verification', href: '/kyc-verification', icon: 'Shield', allowedRoles: ['user', 'provider'], description: 'Verify your identity' }
    ]
}

const communityMenu: NavSection[] = [
    {
        title: 'Community',
        items: [
            { name: 'Home', href: '/', icon: 'Home', allowedRoles: [], description: 'Home page', target: "_blank" },
            { name: 'Community Feed', href: '/community-feed', icon: 'Heart', allowedRoles: [], description: 'Find help requests', target: "_blank" },
            { name: 'Stories', href: '/stories', icon: 'BookOpen', allowedRoles: [], description: 'Read success stories', target: "_blank" },
            { name: 'News & Events', href: '/news-events', icon: 'Calendar', allowedRoles: [], description: 'Browse community news and events', target: "_blank" },
            { name: 'Groups', href: '/groups', icon: 'Users', allowedRoles: [], description: 'Join community groups', target: "_blank" },
        ]
    }
]

const managementMenu: NavSection[] = [
    {
        title: 'Management',
        items: [
            { name: 'My Stories', href: '/my-stories', icon: 'PenTool', allowedRoles: ['user', 'provider', 'admin'], description: 'Manage your stories' },
            { name: 'My Events', href: '/my-events', icon: 'CalendarDays', allowedRoles: ['user', 'provider', 'admin'], description: 'Events you participate in' },
            { name: 'My Requests', href: '/my-requests', icon: 'Target', allowedRoles: ['user', 'provider', 'admin'], description: 'Your help requests and tasks' },
            { name: 'My Tasks', href: '/enhanced-provider-dashboard', icon: 'Briefcase', allowedRoles: ['provider', 'admin'], description: 'Your accepted tasks and offers' },
            { name: 'My Activities', href: '/activity', icon: 'Activity', allowedRoles: ['user', 'provider', 'admin'], description: 'Your activity history' },
            { name: 'My Documents', href: '/documents', icon: 'FileText', allowedRoles: ['user', 'provider', 'admin'], description: 'Manage your documents and certificates' },
        ]
    }
]

const providerMenu: NavSection[] = [
    {
        title: 'Provider Panel',
        items: [
            { name: 'Service Management', href: '/service-management', icon: 'Briefcase', allowedRoles: ['provider', 'admin'], description: 'Manage your services' },
            { name: 'Bookings', href: '/bookings', icon: 'Calendar', allowedRoles: ['provider', 'admin'], description: 'Manage bookings' },
            { name: 'Customers', href: '/customers', icon: 'Users', allowedRoles: ['provider', 'admin'], description: 'Your customers' },
            { name: 'Advertisements', href: '/advertisements', icon: 'Megaphone', allowedRoles: ['provider', 'admin'], description: 'Manage ads' },
            { name: 'Analytics', href: '/analytics', icon: 'TrendingUp', allowedRoles: ['provider', 'admin'], description: 'Service analytics', target: '_blank' },
            { name: 'Reviews', href: '/reviews', icon: 'Star', allowedRoles: ['provider', 'admin'], description: 'Customer reviews', target: '_blank' },
        ]
    }
]

const adminMenu: NavSection[] = [
    {
        title: 'Admin Panel',
        items: [
            { name: 'Authority Requests', href: '/admin/authority-requests', icon: 'Shield', allowedRoles: ['admin'], description: 'Review authority information requests' },
            { name: 'User Management', href: '/admin/users', icon: 'Users', allowedRoles: ['admin'], description: 'Manage all users' },
            { name: 'Content Management', href: '/admin/content', icon: 'FileText', allowedRoles: ['admin'], description: 'Manage content' },
            { name: 'Service Management', href: '/admin/services', icon: 'Briefcase', allowedRoles: ['admin'], description: 'Manage all services' },
            { name: 'Event Management', href: '/admin/events', icon: 'Calendar', allowedRoles: ['admin'], description: 'Manage events' },
            { name: 'Group Management', href: '/admin/groups', icon: 'Users', allowedRoles: ['admin'], description: 'Manage groups' },
            { name: 'Analytics', href: '/admin/analytics', icon: 'BarChart3', allowedRoles: ['admin'], description: 'System analytics', target: '_blank' },
            { name: 'System Settings', href: '/admin/settings', icon: 'Settings', allowedRoles: ['admin'], description: 'System configuration', target: '_blank' },
            { name: 'Database', href: '/admin/database', icon: 'Database', allowedRoles: ['admin'], description: 'Database management', target: '_blank' },
            { name: 'Reports', href: '/admin/reports', icon: 'AlertTriangle', allowedRoles: ['admin'], description: 'System reports', target: '_blank' },
        ]
    }
]

// Public navigation for authorities (not logged in)
const authorityMenu: NavSection[] = [
    {
        title: 'Authority Access',
        items: [
            { name: 'Request Information', href: '/authority-request', icon: 'Shield', allowedRoles: ['user', 'provider', 'admin'], description: 'Submit official information request' },
        ]
    }
];

// Navigation configuration based on user roles
export const navigationConfig: Record<string, NavSection[]> = {
    user: [
        ...dashboardMenu,
        ...communityMenu,
        ...managementMenu.map(item => ({
            ...item,
            items: item.items.map(subItem => ({
                ...subItem,
                ...kycMenu.items
            }))
        })),
    ],
    provider: [
        ...providerDashboardMenu,
        ...providerMenu,
        ...communityMenu,
        ...managementMenu.map(item => ({
            ...item,
            items: item.items.map(subItem => ({
                ...subItem,
                ...kycMenu.items
            }))
        })),
    ],
    admin: [
        ...adminDashboardMenu,
        ...adminMenu,
        ...providerMenu,
        ...communityMenu,
        ...managementMenu,
    ],
    authority: authorityMenu
};

// Helper function to get navigation items for a specific role
export const getNavigationForRole = (role: 'user' | 'provider' | 'admin' | 'authority'): NavSection[] => {
    return navigationConfig[role] || [];
};

// Dashboard links for header dropdown
export const DASHBOARD_LINKS = [
    { name: 'Dashboard', href: '/dashboard', icon: 'User', description: 'Manage your requests' },
    { name: 'Browse Requests', href: '/community-feed', icon: 'Target', description: 'Find help requests' },
];

// Quick links for 404 page
export const QUICK_LINKS = [
    {
        title: "Home",
        description: "Return to the main page",
        path: "/",
        icon: "Home",
        color: "text-blue-600"
    },
    {
        title: "Community Help",
        description: "Find help from our community",
        path: "/community",
        icon: "Users",
        color: "text-green-600"
    },
    {
        title: "Service Discovery",
        description: "Browse available services",
        path: "/service-discovery",
        icon: "Compass",
        color: "text-purple-600"
    },
    {
        title: "News & Events",
        description: "Check upcoming news and events",
        path: "/news-events",
        icon: "Calendar",
        color: "text-orange-600"
    },
    {
        title: "Stories",
        description: "Read community stories",
        path: "/stories",
        icon: "FileText",
        color: "text-indigo-600"
    },
    {
        title: "Support",
        description: "Get help and support",
        path: "/settings",
        icon: "HelpCircle",
        color: "text-red-600"
    }
];

// Helper function to check if a user can access a specific route
export const canAccessRoute = (route: string, userRole: 'user' | 'provider' | 'admin' | 'authority'): boolean => {
    const allNavItems = Object.values(navigationConfig).flatMap(section =>
        section.flatMap(navSection => navSection.items)
    );

    const navItem = allNavItems.find(item => item.href === route);
    return navItem ? navItem.allowedRoles.includes(userRole) : false;
};
