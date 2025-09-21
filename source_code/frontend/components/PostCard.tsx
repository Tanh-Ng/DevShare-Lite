'use client';

import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useEffect, useState } from 'react';

type Post = {
    _id: string;
    title: string;
    content: string;
    author?: {
        _id: string;
        username?: string;
        avatarUrl?: string;
    };
    createdAt: string;
    views: number;
    coverImage?: string;
    likes?: string[];
    comments?: string[];
    starredBy?: string[];
};

export default function PostCard({ post }: { post: Post }) {
    const { user, refresh } = useCurrentUser();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loadingBookmark, setLoadingBookmark] = useState(false);

    const [isStarred, setIsStarred] = useState(false);
    const [loadingStar, setLoadingStar] = useState(false);
    const [starCount, setStarCount] = useState(post.starredBy?.length ?? 0);

    const isAuthorMe = user?._id === post.author?._id;
    const profileLink = isAuthorMe ? '/profile' : `/profile/${post.author?._id}`;

    useEffect(() => {
        if (user) {
            if (user.bookmarkedPosts?.includes(post._id)) {
                setIsBookmarked(true);
            }
            if (post.starredBy?.includes(user._id)) {
                setIsStarred(true);
            }
        }
    }, [user, post]);

    const handleToggleBookmark = async () => {
        if (!user) return alert('Bạn cần đăng nhập');
        try {
            setLoadingBookmark(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/users/bookmarks/${post._id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setIsBookmarked(data.isBookmarked);
                refresh();
            } else {
                alert(data.message || 'Lỗi khi bookmark');
            }
        } catch (err) {
            console.error('Lỗi bookmark:', err);
        } finally {
            setLoadingBookmark(false);
        }
    };

    const handleToggleStar = async () => {
        if (!user) return alert('Bạn cần đăng nhập');
        try {
            setLoadingStar(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/posts/${post._id}/star`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setIsStarred(data.isStarred);
                setStarCount(prev => data.isStarred ? prev + 1 : prev - 1);
            } else {
                alert(data.message || 'Lỗi khi đánh dấu sao');
            }
        } catch (err) {
            console.error('Lỗi star:', err);
        } finally {
            setLoadingStar(false);
        }
    };

    // Don't render if post.author is missing
    if (!post.author) {
        return null;
    }

    return (
        <article className="group card-hover rounded-xl bg-card border border-border p-6 shadow-custom hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                        <Link href={profileLink} className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                                {post.author.avatarUrl ? (
                                    <img
                                        src={post.author.avatarUrl}
                                        alt={post.author.username || 'User'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                        {(post.author.username || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={profileLink}>
                                <span className="font-medium text-foreground hover:text-primary transition-colors text-sm">
                                    {post.author.username || 'Unknown User'}
                                </span>
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                <span>•</span>
                                <span>{Math.ceil(post.content.length / 1000)} min read</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <Link href={`/post/${post._id}`} className="block group/title">
                        <h2 className="text-xl font-bold font-heading text-foreground group-hover/title:text-primary transition-colors mb-3 line-clamp-2">
                            {post.title}
                        </h2>
                    </Link>

                    {/* Preview */}
                    <div className="text-muted-foreground text-sm line-clamp-3 mb-4 prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button
                                onClick={handleToggleStar}
                                disabled={loadingStar}
                                className={`flex items-center gap-2 hover:text-warning transition-colors disabled:opacity-50 ${isStarred ? 'text-warning' : ''
                                    }`}
                            >
                                <svg className="w-4 h-4" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="font-medium">{starCount}</span>
                            </button>

                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="font-medium">{post.views}</span>
                            </span>

                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="font-medium">{post.comments?.length ?? 0}</span>
                            </span>
                        </div>

                        <button
                            onClick={handleToggleBookmark}
                            disabled={loadingBookmark}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 ${isBookmarked
                                ? 'bg-warning/10 text-warning hover:bg-warning/20'
                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                </div>

                {post.coverImage && (
                    <Link href={`/post/${post._id}`} className="flex-shrink-0">
                        <div className="w-40 h-24 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                            <img
                                src={post.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                    </Link>
                )}
            </div>
        </article>
    );

}
