// Mock user data with credentials for different roles

export interface User {
	id: string | number;
	name: string;
	email: string;
	avatar?: string;
	bio?: string;
	location?: string;
	joinDate?: string;
	rating?: number;
	totalHelps?: number;
	totalRequests?: number;
	skills?: string[];
	interests?: string[];
	verified?: boolean;
	role?: 'user' | 'admin' | 'moderator';
	lastActive?: string;
	phone?: string;
	website?: string;
	socialLinks?: {
		facebook?: string;
		twitter?: string;
		linkedin?: string;
		instagram?: string;
	};
}

export interface MockUser {
    id: string | number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'provider' | 'admin';
}

export const currentUser = {
    id: 'current-user',
    name: 'Current User',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 4.8
};

// Demo Users with easy-to-remember credentials
export const demoUsers: MockUser[] = [
    {
        id: 'demo-user-1',
        username: 'johnuser',
        email: 'user@demo.com',
        password: 'user123',
        firstName: 'John',
        lastName: 'User',
        role: 'user'
    },
    {
        id: 'demo-user-2',
        username: 'sarahprovider',
        email: 'provider@demo.com',
        password: 'provider123',
        firstName: 'Sarah',
        lastName: 'Provider',
        role: 'provider'
    },
    {
        id: 'demo-user-3',
        username: 'alexadmin',
        email: 'admin@demo.com',
        password: 'admin123',
        firstName: 'Alex',
        lastName: 'Admin',
        role: 'admin'
    }
];

// Normal Users (10)
export const normalUsers: MockUser[] = [
    {
        id: 'user-1',
        username: 'alicejohnson',
        email: 'alice.johnson@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'user'
    },
    {
        id: 'user-2',
        username: 'bobsmith',
        email: 'bob.smith@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'user'
    },
    {
        id: 'user-3',
        username: 'caroldavis',
        email: 'carol.davis@example.com',
        password: 'password123',
        firstName: 'Carol',
        lastName: 'Davis',
        role: 'user'
    },
    {
        id: 'user-4',
        username: 'davidwilson',
        email: 'david.wilson@example.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Wilson',
        role: 'user'
    },
    {
        id: 'user-5',
        username: 'emmabrown',
        email: 'emma.brown@example.com',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Brown',
        role: 'user'
    },
    {
        id: 'user-6',
        username: 'frankmiller',
        email: 'frank.miller@example.com',
        password: 'password123',
        firstName: 'Frank',
        lastName: 'Miller',
        role: 'user'
    },
    {
        id: 'user-7',
        username: 'gracelee',
        email: 'grace.lee@example.com',
        password: 'password123',
        firstName: 'Grace',
        lastName: 'Lee',
        role: 'user'
    },
    {
        id: 'user-8',
        username: 'henrytaylor',
        email: 'henry.taylor@example.com',
        password: 'password123',
        firstName: 'Henry',
        lastName: 'Taylor',
        role: 'user'
    },
    {
        id: 'user-9',
        username: 'isabellaanderson',
        email: 'isabella.anderson@example.com',
        password: 'password123',
        firstName: 'Isabella',
        lastName: 'Anderson',
        role: 'user'
    },
    {
        id: 'user-10',
        username: 'jackthomas',
        email: 'jack.thomas@example.com',
        password: 'password123',
        firstName: 'Jack',
        lastName: 'Thomas',
        role: 'user'
    }
];

// Service Providers (3)
export const providerUsers: MockUser[] = [
    {
        id: 'provider-1',
        username: 'mikeplumber',
        email: 'mike.plumber@example.com',
        password: 'provider123',
        firstName: 'Mike',
        lastName: 'Plumber',
        role: 'provider'
    },
    {
        id: 'provider-2',
        username: 'sarahtutor',
        email: 'sarah.tutor@example.com',
        password: 'provider123',
        firstName: 'Sarah',
        lastName: 'Tutor',
        role: 'provider'
    },
    {
        id: 'provider-3',
        username: 'alexcleaner',
        email: 'alex.cleaner@example.com',
        password: 'provider123',
        firstName: 'Alex',
        lastName: 'Cleaner',
        role: 'provider'
    }
];

// Admin User (1)
export const adminUser: MockUser = {
    id: 'admin-1',
    username: 'adminuser',
    email: 'admin@sharegarauna.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
};

// All users combined (including demo users)
export const allMockUsers: MockUser[] = [
    ...demoUsers,
    ...normalUsers,
    ...providerUsers,
    adminUser
];

// Helper function to find user by email and password
export const findUserByCredentials = (email: string, password: string): MockUser | null => {
    return allMockUsers.find(user => user.email === email && user.password === password) || null;
};

export const demoUserIds = [
    'demo-user-1', 'demo-user-2', 'demo-user-3', // Demo users
    'user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', // Normal users
    'provider-1', 'provider-2', 'provider-3', // Provider users
    'admin-1' // Admin user
];

export const mockUsers: User[] = [
    {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        avatar: 'https://plus.unsplash.com/premium_photo-1688740375397-34605b6abe48?w=100&h=100&fit=crop&crop=face',
        bio: 'Community organizer and volunteer coordinator. Love helping neighbors and organizing local events.',
        location: 'Downtown District',
        joinDate: 'January 2023',
        rating: 4.9,
        totalHelps: 47,
        totalRequests: 12,
        skills: ['Event Planning', 'Community Outreach', 'Project Management'],
        interests: ['Volunteering', 'Local Events', 'Environmental Causes'],
        verified: true,
        role: 'user',
        lastActive: '2 hours ago',
        phone: '+977 1-4597653',
        socialLinks: {
            facebook: 'https://facebook.com/sarahjohnson',
            instagram: 'https://instagram.com/sarahj_community'
        }
    },
    {
        id: 'current-user',
        name: 'Sarah Johnson',
        role: 'user',
        location: 'Seattle, WA',
        email: 'sarah.johnson@email.com',
        phone: '+1 (206) 555‑2145',
        avatar: 'https://plus.unsplash.com/premium_photo-1688740375397-34605b6abe48?w=300&h=300&fit=crop&crop=face',
        joinDate: 'January 2024',
        rating: 4.9,
        totalHelps: 15,
        totalRequests: 8,
        skills: ['Event Planning', 'Community Outreach', 'Project Management'],
        interests: ['Volunteering', 'Local Events', 'Environmental Causes'],
        verified: true,
        lastActive: '2 hours ago',
        bio: 'I connect neighbors who need help with those who can provide it. Focused on fast responses, careful coordination, and building trust across the community.',
        socialLinks: {
            facebook: 'https://facebook.com/sarahjohnson',
            instagram: 'https://instagram.com/sarahj_community'
        }
    },
    {
        id: 'user-2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Software engineer by day, community helper by passion. Always ready to lend a hand with tech issues or transportation.',
        location: 'Westside',
        joinDate: 'March 2023',
        rating: 4.8,
        totalHelps: 89,
        totalRequests: 23,
        skills: ['Technology Support', 'Transportation', 'Tutoring'],
        interests: ['Technology', 'Education', 'Sustainability'],
        verified: true,
        role: 'user',
        lastActive: '1 day ago',
        website: 'https://michaelchen.dev'
    },
    {
        id: 'user-3',
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        bio: 'Mother of two, passionate about elder care and intergenerational connections. Love cooking and sharing cultural traditions.',
        location: 'East Hills',
        joinDate: 'February 2023',
        rating: 4.9,
        totalHelps: 156,
        totalRequests: 8,
        skills: ['Elder Care', 'Cooking', 'Childcare', 'Cultural Education'],
        interests: ['Family', 'Culture', 'Community Building'],
        verified: true,
        role: 'user',
        lastActive: '30 minutes ago'
    },
    {
        id: 'user-4',
        name: 'David Martinez',
        email: 'david.martinez@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Retired veteran and community leader. Specialize in home repairs, gardening, and veterans support.',
        location: 'North District',
        joinDate: 'December 2022',
        rating: 4.7,
        totalHelps: 203,
        totalRequests: 15,
        skills: ['Home Repair', 'Gardening', 'Veterans Support', 'Leadership'],
        interests: ['Veterans Affairs', 'Home Improvement', 'Community Service'],
        verified: true,
        role: 'moderator',
        lastActive: '3 hours ago'
    },
    {
        id: 'user-5',
        name: 'Admin User',
        email: 'admin@sharegarauna.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Platform administrator and community coordinator.',
        location: 'City Center',
        joinDate: 'October 2022',
        rating: 5.0,
        totalHelps: 0,
        totalRequests: 0,
        skills: ['Administration', 'Community Management', 'Platform Development'],
        interests: ['Technology', 'Community Development', 'Social Impact'],
        verified: true,
        role: 'admin',
        lastActive: '5 minutes ago'
    }
];

export const getDemoCredentials = (): Array<{
    role: string;
    email: string;
    password: string;
    displayName: string;
}> => {
    return [
        {
            role: 'user',
            email: 'user@demo.com',
            password: 'user123',
            displayName: 'Regular User'
        },
        {
            role: 'provider',
            email: 'provider@demo.com',
            password: 'provider123',
            displayName: 'Service Provider'
        },
        {
            role: 'admin',
            email: 'admin@demo.com',
            password: 'admin123',
            displayName: 'Administrator'
        }
    ];
}
