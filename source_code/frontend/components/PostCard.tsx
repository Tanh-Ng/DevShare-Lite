'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
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
};

export default function PostCard({ post }: { post: Post }) {
    const { user, refresh } = useCurrentUser();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loadingBookmark, setLoadingBookmark] = useState(false);

    const isAuthorMe = user?._id === post.author._id;
    const profileLink = isAuthorMe ? '/profile' : `/profile/${post.author._id}`;

    useEffect(() => {
        if (user?.bookmarkedPosts) {
            setIsBookmarked(user.bookmarkedPosts.includes(post._id));
        }
    }, [user, post._id]);

    const handleToggleBookmark = async () => {
        if (!user) return alert('Bạn cần đăng nhập');
        try {
            setLoadingBookmark(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/users/bookmarks/${post._id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setIsBookmarked(data.isBookmarked);
                refresh(); // cập nhật lại thông tin user
            } else {
                alert(data.message || 'Lỗi khi bookmark');
            }
        } catch (err) {
            console.error('Lỗi bookmark:', err);
        } finally {
            setLoadingBookmark(false);
        }
    };

    return (
        <div className="flex items-start justify-between border-b py-6 gap-6">
            {/* Nội dung bên trái */}
            <div className="flex-1">
                {/* Tác giả */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Link href={profileLink}>
                        {post.author.avatarUrl ? (
                            <img
                                src={post.author.avatarUrl}
                                alt={post.author.username}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300" />
                        )}
                    </Link>
                    <Link href={profileLink}>
                        <span className="hover:underline">{post.author.username}</span>
                    </Link>
                </div>

                {/* Tiêu đề */}
                <Link href={`/post/${post._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 hover:underline mb-1">
                        {post.title}
                    </h2>
                </Link>

                {/* Tóm tắt */}
                <div className="text-gray-700 text-sm line-clamp-2 mb-2">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Metadata + Bookmark */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    {/* Stats */}
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                            <Image src="/star.png" alt="star" width={14} height={14} />
                            {post.likes?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Image src="/views.png" alt="views" width={14} height={14} />
                            {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Image src="/starred.png" alt="comment" width={14} height={14} />
                            {post.comments?.length ?? 0}
                        </span>
                    </div>

                    {/* Bookmark */}
                    <button
                        onClick={handleToggleBookmark}
                        disabled={loadingBookmark}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md transition
              ${isBookmarked
                                ? 'bg-yellow-100 text-yellow-700 font-semibold'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              disabled:opacity-50`}
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

            {/* Ảnh bìa bên phải */}
            {post.coverImage && (
                <Link href={`/post/${post._id}`}>
                    <img
                        src={post.coverImage}
                        alt="Cover"
                        className="w-40 h-24 rounded object-cover shrink-0"
                    />
                </Link>
            )}
        </div>
    );
}
