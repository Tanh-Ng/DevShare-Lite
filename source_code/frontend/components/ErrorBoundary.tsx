'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="max-w-md mx-auto text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-foreground mb-4">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-muted-foreground mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary px-6 py-2 rounded-lg text-sm font-medium w-full"
                            >
                                Refresh Page
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="btn-secondary px-6 py-2 rounded-lg text-sm font-medium w-full"
                            >
                                Go Back
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                    Error Details (Development)
                                </summary>
                                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
