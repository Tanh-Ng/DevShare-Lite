'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

          {/* Avatar Placeholder */}
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
              U
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
