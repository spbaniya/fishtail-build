import { createBrowserRouter, createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { AuthProvider } from './domains/auth/contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './shared/i18n';
import { lazy, Suspense } from 'react';
import './App.css';
import { Toaster } from '@/shared/components/ui/toaster';
import ErrorBoundary from './shared/components/ui/ErrorBoundary';
import LayoutWrapper from './shared/components/LayoutWrapper';
import ScrollToTop from './shared/components/ScrollToTop';
import ProtectedRoute from './domains/auth/components/ProtectedRoute';
import LoadingSpinner from './shared/components/ui/LoadingSpinner';
import { Index } from '@/domains/landing/pages/Index';
import { useAntiDevTools } from './shared/hooks/antiDevTools';
import NotFound from "@/shared/pages/NotFound.tsx";
import Login from "@/domains/auth/pages/Login.tsx";
import Register from "@/domains/auth/pages/Register.tsx";
import Dashboard from "@/domains/dashboard/pages/Dashboard.tsx";
import { QueryProvider } from './domains/auth/contexts/QueryProvider';
import Home from './domains/landing/pages/Home';

const queryClient = new QueryClient();

type WithErrorHandlerProps = {
    Layout: React.ComponentType<any>;
    fallback?: React.ReactNode;
    isPublic?: boolean;
    isAuth?: boolean;
    [key: string]: any;
};

export const WithErrorHandler = ({
    Layout,
    fallback,
    ...props
}: WithErrorHandlerProps) => {
    return (
        <ErrorBoundary fallback={fallback}>
            <Layout {...props} />
        </ErrorBoundary>
    );
};

const routes = [
    {
        path: "/",
        element: <WithErrorHandler Layout={LayoutWrapper} isPublic />,
        children: [
            { index: true, element: <Home /> },
        ]
    },
    {
        path: "/",
        element: <WithErrorHandler Layout={LayoutWrapper} isAuth />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ]
    },
    {
        path: "/",
        element: <WithErrorHandler Layout={LayoutWrapper} />,
        children: [
            {
                path: "",
                element: <ProtectedRoute allowedRoles={['user', 'provider', 'admin']} />,
                children: [
                    { path: "dashboard", element: <Dashboard /> },
                ]
            },
            {
                path: "",
                element: <ProtectedRoute allowedRoles={['provider', 'admin']} />,
                children: [

                ]
            },
            {
                path: "",
                element: <ProtectedRoute allowedRoles={['admin']} />,
                children: [

                ]
            },
        ]
    },
    {
        path: "/404",
        element: <LayoutWrapper isAuth />,
        children: [
            { index: true, element: <NotFound /> }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    },
];

const router = createHashRouter(routes);

function App() {
    // Kill page if DevTools is opened (docked OR undocked)
    // useAntiDevTools({ action: "blank" });
    return (
        <QueryProvider>
            <I18nextProvider i18n={i18n}>
                <ErrorBoundary>
                    <HelmetProvider>
                        <QueryClientProvider client={queryClient}>
                            <ThemeProvider>
                                <AuthProvider>
                                    <Suspense fallback={
                                        <div className="min-h-screen flex items-center justify-center">
                                            <LoadingSpinner size="lg" />
                                        </div>
                                    }>
                                        <RouterProvider router={router} />
                                    </Suspense>
                                    <ScrollToTop />
                                    <Toaster />
                                </AuthProvider>
                            </ThemeProvider>
                        </QueryClientProvider>
                    </HelmetProvider>
                </ErrorBoundary>
            </I18nextProvider>
        </QueryProvider>
    );
}

export default App;
