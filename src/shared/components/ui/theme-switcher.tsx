
import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { useTheme, DISPLAY_THEMES } from '@/shared/contexts/ThemeContext';

export const ThemeSwitcher = () => {
    const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="h-9 w-9"
            >
                {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                ) : (
                    <Sun className="h-4 w-4" />
                )}
            </Button>

            {/* Color Theme Selector */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <Palette className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="grid grid-cols-3 gap-1 p-1">
                        {DISPLAY_THEMES.map((theme) => (
                            <DropdownMenuItem
                                key={theme.id}
                                onClick={() => {
                                    setColorTheme(theme.id as any);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-2 cursor-pointer ${colorTheme === theme.id ? 'bg-accent' : ''
                                    }`}
                            >
                                <div
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: theme.color }}
                                />
                                <span className="text-sm">{theme.name}</span>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
