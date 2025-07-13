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
    author: {
        _id: string;
        username: string;
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

    const isAuthorMe = user?._id === post.author._id;
    const profileLink = isAuthorMe ? '/profile' : `/profile/${post.author._id}`;

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

    return (
        <div className="flex items-start justify-between rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-5 shadow-md hover:shadow-lg transition duration-300 gap-6">
            <div className="flex-1">
                {/* Author */}
                <div className="flex items-center gap-2 text-sm text-black-400 mb-1">
                    <Link href={profileLink}>
                        <img
                            src={post.author.avatarUrl || '/avatar.png'}
                            alt={post.author.username}
                            className="w-7 h-7 rounded-full object-cover"
                        />
                    </Link>
                    <Link href={profileLink}>
                        <span className="hover:underline text-black font-medium">{post.author.username}</span>
                    </Link>
                    <span className="text-gray-500">• {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                {/* Title */}
                <Link href={`/post/${post._id}`}>
                    <h2 className="text-xl font-bold text-black hover:text-blue-400 transition mb-1">
                        {post.title}
                    </h2>
                </Link>

                {/* Preview */}
                <div className="text-gray-600 text-sm line-clamp-2 mb-2 prose prose-sm max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs mt-3">
                    <div className="flex items-center gap-4 text-gray-400">
                        <button
                            onClick={handleToggleStar}
                            disabled={loadingStar}
                            className="flex items-center gap-1 hover:text-yellow-400 transition"
                        >
                            <Image
                                src={isStarred ? '/starred.png' : '/star.png'}
                                alt="star"
                                width={14}
                                height={14}
                            />
                            {starCount}
                        </button>

                        <span className="flex items-center gap-1">
                            <Image src="/views.png" alt="views" width={14} height={14} />
                            {post.views}
                        </span>

                        <span className="flex items-center gap-1">
                            <Image src="/comments.png" alt="comment" width={14} height={14} />
                            {post.comments?.length ?? 0}
                        </span>
                    </div>

                    <button
                        onClick={handleToggleBookmark}
                        disabled={loadingBookmark}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${isBookmarked
                                ? 'bg-yellow-400/10 text-yellow-300 font-semibold'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            } disabled:opacity-50`}
                    >
                        <Image
                            src={isBookmarked ? '/bookmarked.png' : '/bookmark.png'}
                            alt="bookmark"
                            width={16}
                            height={16}
                        />
                        <span>{isBookmarked ? 'Đã lưu' : 'Lưu'}</span>
                    </button>
                </div>
            </div>

            {post.coverImage && (
                <Link href={`/post/${post._id}`}>
                    <img
                        src={post.coverImage}
                        alt="Cover"
                        className="w-40 h-24 rounded-lg object-cover shadow-sm"
                    />
                </Link>
            )}
        </div>
    );

}
