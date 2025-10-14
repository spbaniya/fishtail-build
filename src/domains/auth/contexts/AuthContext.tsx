import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Api } from '@/shared/lib/api';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from './QueryProvider';

interface User {
    id: string | number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'provider' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: () => void;
    register: () => void;
    logout: () => Promise<void>;
    forgotPassword: () => void;
    verifyEmail: (token: string) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { query } = useQuery();
    // http://localhost:8080/?session_token=lx0yC7hcg7g1aF6wskWQccg8qxsLOIjwMQufv2Cz6l5Ad4H0ek7j9TCCjUr9eOOtwbvtZbcGMRbDVEIiuM3vz6g2DZ9g1yrsONUKSIFFdls_J9ND6kCJQ67KnMnhQer7Z8Ncd_bMwMEw4N8B9VL9zfIUL7BKnTKmTIKlu4NAiwz25GCN6199l1ISFfbVrEftZlulhu71cRvzMtswt2lf91WT-VCy6gHMtAIesuVOouLWuzvGrKp0dbwP_rM8s3FCzaaYJ_YjEWkIhw9ZnxIM-0ca97mziuAeu6hqXUoD726AjYv86To8w8_mlFDtE3IY7W1gpMhZdKCjGm2FFAASGeFrKRJRL5x-gyvr3mG4cL3mOyExayr2N67fYNn-BGuvluSTUwn4oQ-WqW3NwByWdWILfBsWqJEHUx2leABVmJ1xpccNNeHrElHR3N7YB9kk_ncHDVp-Owgb2-Ce1F3XzaHI-82L-Z6PApn1yCTmj9r0CBlCUw9HTksv6hRvjzqiIqmgrtvaCWfaQBxbd09fBP_P2qJ6403pqdcZO2egNf3nTmjqP-ZZsRcZWeVnqBnhVwFYZ69QXBc6WDHB93P35X7AuWUR9fnv3o2wi7rF_uj1g5rC5TIWQCTtjPUykVaMzILQechdcDlojzPJAaAfSdvmeqOKNOZ2cXVZ7s2y25iwKcBE1cJ_fw25RImOH3-PydnP4_NCyjccB7rQlg&success=true&user_id=356762347846504449&username=sujit.baniya%40edelberg.com#/dashboard


    // Get backend auth URLs
    const getAuthUrls = () => {
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const dashboardUrl = `${window.location.origin}/#/dashboard`;
        return {
            login: `${baseUrl}/auth/login?redirect=${encodeURIComponent(dashboardUrl)}`,
            register: `${baseUrl}/auth/register?redirect=${encodeURIComponent(window.location.href)}`,
            forgotPassword: `${baseUrl}/auth/forgot-password?redirect=${encodeURIComponent(window.location.href)}`,
            logout: `${baseUrl}/logout?redirect=${encodeURIComponent(window.location.origin)}`,
        };
    };

    const initializeAuth = async () => {
        try {

            // Check if we have user data from query parameters after login redirect
            const queryUserId = query.user_id;
            const queryUsername = query.username;
            const querySuccess = query.success;
            const querySessionToken = query.session_token;

            // If we have query parameters from successful login, use them to set user data
            if (querySuccess === 'true' && queryUserId && queryUsername) {

                // Handle query parameters that can be string or string[]
                const userId = Array.isArray(queryUserId) ? queryUserId[0] : queryUserId;
                const username = Array.isArray(queryUsername) ? queryUsername[0] : queryUsername;
                const sessionToken = Array.isArray(querySessionToken) ? querySessionToken[0] : querySessionToken;

                const userData: User = {
                    id: userId,
                    email: decodeURIComponent(username),
                    firstName: '',
                    lastName: '',
                    role: 'user' // Default role, can be updated from API if needed
                };

                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));

                // Also store session token if provided
                if (sessionToken) {
                    localStorage.setItem('session_token', sessionToken);
                }
            } else {
                // Fallback to API call for existing sessions
                const userInfo = await Api.get('/api/userinfo');
                console.log('Fetched user info:', userInfo);

                if (userInfo) {
                    const userData: User = {
                        id: (userInfo as any).id,
                        email: (userInfo as any).email,
                        firstName: (userInfo as any)?.firstName || '',
                        lastName: (userInfo as any)?.lastName || '',
                        role: (userInfo as any)?.role || 'user'
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = (): void => {
        const { login: loginUrl } = getAuthUrls();
        window.location.href = loginUrl;
    };

    const register = (): void => {
        const { register: registerUrl } = getAuthUrls();
        window.location.href = registerUrl;
    };

    const logout = async (): Promise<void> => {
        try {
            // Make POST request to logout endpoint
            await Api.post('/logout', {}, { withAuth: true });

            // Clear local state after successful logout
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('header');

            // Note: httpOnly cookies cannot be cleared from JavaScript
            // The backend logout endpoint should handle clearing the session_token cookie

            // Redirect to home page or login page after logout
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear local state even if API call fails
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('header');

            // Still redirect to home page
            window.location.href = '/';
        }
    };

    const forgotPassword = (): void => {
        const { forgotPassword: forgotPasswordUrl } = getAuthUrls();
        window.location.href = forgotPasswordUrl;
    };

    const verifyEmail = (token: string): void => {
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const verifyUrl = `${baseUrl}/auth/verify-email?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(window.location.href)}`;
        window.location.href = verifyUrl;
    };

    const value: AuthContextType = {
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        forgotPassword,
        verifyEmail,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
