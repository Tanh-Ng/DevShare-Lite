'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, FileText } from 'lucide-react';

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
            <div className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-border bg-card text-card-foreground ring-offset-background focus-within:ring-2 focus-within:ring-primary/40 transition">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search posts or users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
                />
            </div>

            {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-card text-card-foreground border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-auto">
                    {userResults.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 font-semibold border-b border-border bg-muted/50">
                                <Users className="w-4 h-4" />
                                <span>User</span>
                            </div>
                            {userResults.map((user) => (
                                <Link
                                    key={user._id}
                                    href={`/profile/${user._id}`}
                                    onClick={handleClick}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-accent text-sm"
                                >
                                    <img
                                        src={user.avatarUrl || '/avatar.png'}
                                        alt={user.username}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span>{user.username}</span>
                                    <span className="text-muted-foreground text-xs ml-auto">{user.email}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {postResults.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 px-4 py-2 font-semibold border-b border-border bg-muted/50">
                                <FileText className="w-4 h-4" />
                                <span>Post</span>
                            </div>
                            {postResults.map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/post/${post._id}`}
                                    onClick={handleClick}
                                    className="block px-4 py-2 hover:bg-accent text-sm"
                                >
                                    {post.title}
                                    {post.author?.username && (
                                        <span className="text-muted-foreground text-xs ml-1"> – {post.author.username}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    {userResults.length === 0 && postResults.length === 0 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}
