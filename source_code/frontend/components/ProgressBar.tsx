'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const start = () => {
            setProgress(0);
            setIsVisible(true);
            timeout = setTimeout(() => setProgress(30), 100);
        };

        const complete = () => {
            setProgress(100);
            setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
            }, 200);
        };

        const handleStart = () => start();
        const handleComplete = () => complete();

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            clearTimeout(timeout);
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router.events]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
            <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
