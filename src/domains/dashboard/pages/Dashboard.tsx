import React from 'react';
import { useAuth } from '@/domains/auth/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { User, Mail, Shield, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground">You need to be logged in to view this page.</p>
                </div>
            </div>
        );
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'provider':
                return 'bg-blue-100 text-blue-800';
            case 'user':
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! This is a protected page that requires authentication.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                User Profile
                            </CardTitle>
                            <CardDescription>
                                Your account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <Badge className={getRoleColor(user.role)}>
                                        {user.role.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">User ID:</span>
                                    <span className="font-mono">{user.id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Authentication Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Authentication Status
                            </CardTitle>
                            <CardDescription>
                                Current session information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium">Logged In</span>
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>You have successfully authenticated and can access protected content.</p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={logout}
                                className="w-full"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Test Content */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Protected Content Test</CardTitle>
                        <CardDescription>
                            This content is only visible to authenticated users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                If you can see this content, it means:
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                <li>You are successfully logged in</li>
                                <li>The authentication system is working correctly</li>
                                <li>The protected route is functioning as expected</li>
                                <li>User data is being properly stored and retrieved</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
