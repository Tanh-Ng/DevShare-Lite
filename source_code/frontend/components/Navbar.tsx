'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const username = "User123";
  const router = useRouter();

  return (
    <header className="bg-background border-b border-border relative z-50">
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
        <div className="hidden md:flex items-center gap-5 relative">
          <Link
            href="/write"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <Image
              src="/blog.png"
              alt="Write icon"
              width={16}
              height={16}
              className="object-contain"
            />
            Write
          </Link>

          {/* Notification Icon */}
          <button className="text-foreground hover:text-primary transition">
            <img
              src="/ringing.png"
              alt="Notification"
              className="w-5 h-5 object-contain"
            />
          </button>

          {/* Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold"
            >
              U
            </button>

            {isProfileOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-border rounded-md shadow-lg z-50 text-sm text-foreground">
                <div className="px-4 py-2 border-b border-border font-semibold">
                  {username}
                </div>
                <Link href="/profile" className="block px-4 py-2 hover:bg-muted">
                  Profile
                </Link>
                <Link href="/your-posts" className="block px-4 py-2 hover:bg-muted">
                  Your Posts
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token'); 
                    router.push('/');          
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-muted"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger (optional) */}
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
    </header>
  );
}
