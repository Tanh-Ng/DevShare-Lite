'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold text-primary">
          DevShareLite
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {/* Search Bar */}
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full px-3 py-2 rounded-md bg-muted text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/write" className="text-sm text-muted-foreground hover:text-foreground transition">
            Write
          </Link>

          {/* Notification Icon */}
          <button className="text-foreground hover:text-primary transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405C18.79 14.79 18 13.42 18 12V9a6 6 0 10-12 0v3c0 1.42-.79 2.79-1.595 3.595L3 17h5m4 0v1a2 2 0 11-4 0v-1m4 0H9" />
            </svg>
          </button>

          {/* Avatar Placeholder */}
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
              U
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm text-muted-foreground">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full px-3 py-2 rounded-md bg-muted text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <Link href="/write" className="block hover:text-foreground">
            Write
          </Link>

          <Link href="/profile" className="block hover:text-foreground">
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
