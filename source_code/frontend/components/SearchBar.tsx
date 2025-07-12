// components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            fetch(`http://localhost:3000/posts/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setShowDropdown(true);
                })
                .catch(console.error);
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Tìm bài viết..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
            />

            {showDropdown && results.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50">
                    {results.map((post) => (
                        <Link
                            key={post._id}
                            href={`/post/${post._id}`}
                            className="block px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => {
                                setQuery('');
                                setShowDropdown(false);
                            }}
                        >
                            {post.title}
                        </Link>
                    ))}
                </div>
            )}

            {/* Trường hợp không tìm thấy */}
            {showDropdown && query && results.length === 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50 px-4 py-2 text-sm text-gray-500">
                    Không tìm thấy bài viết.
                </div>
            )}
        </div>
    );
}
