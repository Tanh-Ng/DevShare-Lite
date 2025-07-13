'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
    _id: string;
    title: string;
    author?: {
        username?: string;
    };
}

interface User {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [postResults, setPostResults] = useState<Post[]>([]);
    const [userResults, setUserResults] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!query.trim()) {
                setPostResults([]);
                setUserResults([]);
                setShowDropdown(false);
                return;
            }

            const fetchResults = async () => {
                try {
                    const [postRes, userRes] = await Promise.all([
                        fetch(`http://localhost:3000/posts/search?q=${encodeURIComponent(query)}`),
                        fetch(`http://localhost:3000/users/search?q=${encodeURIComponent(query)}`)
                    ]);

                    const posts = await postRes.json();
                    const users = await userRes.json();

                    setPostResults(posts);
                    setUserResults(users);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Search error:', error);
                }
            };

            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleClick = () => {
        setQuery('');
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Tìm bài viết hoặc người dùng..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
            />

            {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50 max-h-80 overflow-auto">
                    {userResults.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 border-b bg-gray-50">
                                <Image src="/user.png" alt="User" width={16} height={16} />
                                Người dùng
                            </div>
                            {userResults.map((user) => (
                                <Link
                                    key={user._id}
                                    href={`/profile/${user._id}`}
                                    onClick={handleClick}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    <img
                                        src={user.avatarUrl || '/avatar.png'}
                                        alt={user.username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span>{user.username}</span>
                                    <span className="text-gray-400 text-xs ml-auto">{user.email}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {postResults.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 border-b bg-gray-50">
                                <Image src="/posts.png" alt="Post" width={16} height={16} />
                                Bài viết
                            </div>
                            {postResults.map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/post/${post._id}`}
                                    onClick={handleClick}
                                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    {post.title}
                                    {post.author?.username && (
                                        <span className="text-gray-400 text-xs ml-1"> – {post.author.username}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    {userResults.length === 0 && postResults.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">Không tìm thấy kết quả.</div>
                    )}
                </div>
            )}
        </div>
    );
}
