import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/domains/auth/contexts/AuthContext';
import { Button } from './button';
import { Avatar, AvatarFallback } from './avatar';
import { Badge } from './badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './dropdown-menu';
import {
    User,
    Settings,
    LogOut,
    BarChart3,
    ChevronUp,
    ChevronDown,
    Users,
    Database,
    Activity,
    AlertTriangle
} from 'lucide-react';

interface UserDropdownProps {
    collapsed?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ collapsed = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'provider':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'user':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Super Admin';
            case 'provider':
                return 'Verified Provider';
            case 'user':
                return 'Community Member';
            default:
                return role;
        }
    };

    if (collapsed) {
        return (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full p-2 h-10 flex items-center justify-center hover:bg-surface transition-colors duration-200"
                        title="User Menu"
                    >
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                    <Badge variant="outline" className={`w-fit text-xs mt-1 ${getRoleColor(user?.role || '')}`}>
                                        {getRoleBadge(user?.role || '')}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full p-3 h-auto flex items-center justify-between hover:bg-surface transition-colors duration-200"
                >
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-foreground-muted truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-foreground-muted" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-foreground-muted" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <Badge variant="outline" className={`w-fit text-xs ${getRoleColor(user?.role || '')}`}>
                            {getRoleBadge(user?.role || '')}
                        </Badge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
