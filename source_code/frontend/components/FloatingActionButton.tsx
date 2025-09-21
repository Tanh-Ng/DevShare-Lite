'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Menu Items */}
            <div className={`absolute bottom-16 right-0 space-y-3 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}>
                <Link
                    href="/write"
                    className="flex items-center gap-3 bg-card text-card-foreground px-4 py-3 rounded-lg shadow-lg border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="font-medium">Write Post</span>
                </Link>

                <Link
                    href="/search"
                    className="flex items-center gap-3 bg-card text-card-foreground px-4 py-3 rounded-lg shadow-lg border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="font-medium">Search</span>
                </Link>

                <Link
                    href="/profile"
                    className="flex items-center gap-3 bg-card text-card-foreground px-4 py-3 rounded-lg shadow-lg border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Profile</span>
                </Link>
            </div>

            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group
          ${isOpen ? 'rotate-45' : 'hover:scale-110'}
        `}
                aria-label="Open quick actions"
            >
                <svg
                    className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
                    />
                </svg>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
