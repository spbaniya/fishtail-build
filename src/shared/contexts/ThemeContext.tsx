
import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorTheme =
    | 'coral' | 'ocean' | 'nepal';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    colorTheme: ColorTheme;
    setTheme: (theme: Theme) => void;
    setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const DISPLAY_THEMES = [
    { id: 'coral', name: 'Coral', color: '#DF6D6D' },
    { id: 'ocean', name: 'Ocean', color: '#1F7E9D' },
    { id: 'nepal', name: 'Nepal', color: '#B23A4C' } // same red, different scheme
] as const;

const colorThemes: Record<ColorTheme, { primary: string; secondary: string; accent: string }> = {
    coral: { primary: '4 65% 66%', secondary: '140 35% 45%', accent: '45 85% 60%' },
    ocean: { primary: '198 69% 36%', secondary: '180 25% 90%', accent: '180 25% 85%' },
    nepal: { primary: '348 60% 55%', secondary: '217 50% 40%', accent: '45 85% 60%' }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('theme') as Theme) || 'light';
        }
        return 'light';
    });

    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('colorTheme') as ColorTheme) || 'coral';
        }
        return 'nepal';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Apply theme class
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Apply color theme variables
        const colors = colorThemes[colorTheme];
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--accent', colors.accent);

        // Store in localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('colorTheme', colorTheme);
    }, [theme, colorTheme]);

    return (
        <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
