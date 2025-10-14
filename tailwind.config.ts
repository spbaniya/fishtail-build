
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
                'nunito': ['Nunito', 'sans-serif'],
                'raleway': ['Raleway', 'sans-serif'],
                'open-sans': ['Open Sans', 'sans-serif'],
                'lato': ['Lato', 'sans-serif'],
                'pt-sans': ['PT Sans', 'sans-serif'],
                'bebas': ['Bebas Neue', 'cursive'],
                'sans': ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                'border-hover': 'hsl(var(--border-hover))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                surface: 'hsl(var(--surface))',
                'surface-elevated': 'hsl(var(--surface-elevated))',
                foreground: 'hsl(var(--foreground))',
                'foreground-muted': 'hsl(var(--foreground-muted))',
                'foreground-subtle': 'hsl(var(--foreground-subtle))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    hover: 'hsl(var(--primary-hover))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    hover: 'hsl(var(--secondary-hover))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    hover: 'hsl(var(--accent-hover))'
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))'
                },
                error: {
                    DEFAULT: 'hsl(var(--error))',
                    foreground: 'hsl(var(--error-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'var(--radius-sm)'
            },
            boxShadow: {
                'community': 'var(--shadow)',
                'community-md': 'var(--shadow-md)',
                'community-sm': 'var(--shadow-sm)',
                'community-lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            },
            keyframes: {
                'gentle-bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' }
                },
                'fade-in-up': {
                    'from': {
                        opacity: '0',
                        transform: 'translateY(24px)'
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fade-in': {
                    'from': {
                        opacity: '0'
                    },
                    'to': {
                        opacity: '1'
                    }
                }
            },
            animation: {
                'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'fade-in': 'fade-in 0.5s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
