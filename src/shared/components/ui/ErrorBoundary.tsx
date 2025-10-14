import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Download, ExternalLink } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showErrorDetails?: boolean;
    enableErrorReporting?: boolean;
    maxRetries?: number;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    errorId: string | null;
    retryCount: number;
    lastErrorTime: number | null;
}

class ErrorBoundary extends Component<Props, State> {
    private retryTimeouts: NodeJS.Timeout[] = [];

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
            retryCount: 0,
            lastErrorTime: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Generate unique error ID
        const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            hasError: true,
            error,
            errorId,
            lastErrorTime: Date.now(),
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { onError, enableErrorReporting = true } = this.props;

        // Enhanced logging
        console.group('🚨 ErrorBoundary - Error Caught');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error ID:', this.state.errorId);
        console.error('User Agent:', navigator.userAgent);
        console.error('URL:', window.location.href);
        console.error('Timestamp:', new Date().toISOString());
        console.groupEnd();

        // Call custom error handler if provided
        if (onError) {
            onError(error, errorInfo);
        }

        // Update state with error info
        this.setState({
            error,
            errorInfo,
        });

        // Send error to reporting service if enabled
        if (enableErrorReporting) {
            this.reportError(error, errorInfo);
        }
    }

    componentWillUnmount() {
        // Clear any pending retry timeouts
        this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    }

    private reportError = (error: Error, errorInfo: ErrorInfo) => {
        const errorReport = {
            id: this.state.errorId,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            retryCount: this.state.retryCount,
        };

        // In a real app, you would send this to your error reporting service
        // Example: errorReportingService.captureException(error, { extra: errorReport });

        // For now, store in localStorage for debugging
        try {
            const existingReports = JSON.parse(localStorage.getItem('errorReports') || '[]');
            existingReports.push(errorReport);
            // Keep only last 10 reports
            if (existingReports.length > 10) {
                existingReports.shift();
            }
            localStorage.setItem('errorReports', JSON.stringify(existingReports));
        } catch (e) {
            console.warn('Failed to store error report:', e);
        }
    };

    private categorizeError = (error: Error): string => {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch')) {
            return 'Network Error';
        }
        if (message.includes('reference') || message.includes('undefined')) {
            return 'Reference Error';
        }
        if (message.includes('type') || message.includes('cannot read')) {
            return 'Type Error';
        }
        if (message.includes('syntax')) {
            return 'Syntax Error';
        }
        if (message.includes('chunk') || message.includes('loading')) {
            return 'Loading Error';
        }

        return 'Application Error';
    };

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
            retryCount: 0,
            lastErrorTime: null,
        });
    };

    private handleRetry = () => {
        const { maxRetries = 3 } = this.props;
        const { retryCount } = this.state;

        if (retryCount < maxRetries) {
            this.setState(prevState => ({
                retryCount: prevState.retryCount + 1,
            }));

            // Add a small delay before retry
            const timeout = setTimeout(() => {
                this.handleReset();
            }, 1000);

            this.retryTimeouts.push(timeout);
        }
    };

    private copyErrorDetails = () => {
        const { error, errorInfo, errorId } = this.state;
        if (!error) return;

        const errorDetails = {
            id: errorId,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
            .then(() => alert('Error details copied to clipboard'))
            .catch(() => alert('Failed to copy error details'));
    };

    private downloadErrorReport = () => {
        const { error, errorInfo, errorId } = this.state;
        if (!error) return;

        const errorReport = {
            id: errorId,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            retryCount: this.state.retryCount,
        };

        const blob = new Blob([JSON.stringify(errorReport, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-report-${errorId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { error, errorInfo, errorId, retryCount } = this.state;
            const { maxRetries = 3, showErrorDetails = import.meta.env.DEV } = this.props;
            const errorCategory = error ? this.categorizeError(error) : 'Unknown Error';
            const canRetry = retryCount < maxRetries;

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
                    <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center border border-gray-200">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="h-10 w-10 text-red-600" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Oops! Something went wrong
                        </h1>

                        {/* Error Category */}
                        <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
                            <Bug className="h-4 w-4 mr-2" />
                            {errorCategory}
                        </div>

                        {/* Error Message */}
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            We're sorry, but an unexpected error occurred. Our team has been notified and is working to fix this issue.
                        </p>

                        {/* Error ID */}
                        {errorId && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-6">
                                <p className="text-sm text-gray-500">
                                    Error ID: <code className="bg-gray-200 px-2 py-1 rounded text-xs">{errorId}</code>
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Button
                                onClick={this.handleReset}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                <RefreshCw className="h-5 w-5" />
                                Try Again
                            </Button>

                            {canRetry && (
                                <Button
                                    onClick={this.handleRetry}
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                    size="lg"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                    Retry ({retryCount}/{maxRetries})
                                </Button>
                            )}

                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                size="lg"
                            >
                                <Home className="h-5 w-5" />
                                Go Home
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                size="lg"
                            >
                                <ExternalLink className="h-5 w-5" />
                                Reload Page
                            </Button>
                        </div>

                        {/* Error Details (Development/Show Details) */}
                        {showErrorDetails && error && (
                            <details className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                                    <Bug className="h-4 w-4 mr-2" />
                                    Technical Details
                                    <div className="ml-auto flex gap-2">
                                        <Button
                                            onClick={this.copyErrorDetails}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            onClick={this.downloadErrorReport}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                        >
                                            <Download className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </summary>
                                <div className="mt-4 space-y-4 text-xs font-mono">
                                    <div>
                                        <strong className="text-gray-700">Error Message:</strong>
                                        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-800">
                                            {error.message}
                                        </div>
                                    </div>

                                    {error.stack && (
                                        <div>
                                            <strong className="text-gray-700">Stack Trace:</strong>
                                            <pre className="mt-1 p-2 bg-gray-100 border rounded overflow-auto max-h-32 whitespace-pre-wrap text-gray-800">
                                                {error.stack}
                                            </pre>
                                        </div>
                                    )}

                                    {errorInfo?.componentStack && (
                                        <div>
                                            <strong className="text-gray-700">Component Stack:</strong>
                                            <pre className="mt-1 p-2 bg-gray-100 border rounded overflow-auto max-h-32 whitespace-pre-wrap text-gray-800">
                                                {errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                                        <div>
                                            <strong>Timestamp:</strong><br />
                                            {new Date().toLocaleString()}
                                        </div>
                                        <div>
                                            <strong>URL:</strong><br />
                                            {window.location.href}
                                        </div>
                                        <div>
                                            <strong>User Agent:</strong><br />
                                            {navigator.userAgent.substring(0, 50)}...
                                        </div>
                                        <div>
                                            <strong>Retry Count:</strong><br />
                                            {retryCount}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        )}

                        {/* Support Information */}
                        <div className="text-center text-sm text-gray-500">
                            <p>If this problem persists, please contact our support team with the error ID above.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
