'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

type Post = {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
    };
    createdAt: string;
    views: number;
    coverImage?: string;
    likes?: string[];
    comments?: string[];
};

export default function PostCard({ post }: { post: Post }) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString();

    return (
        <div className="flex items-start justify-between border-b py-6 gap-6">
            {/* Bên trái: nội dung bài viết */}
            <div className="flex-1">
                {/* Tác giả */}
                <p className="text-sm text-gray-500 mb-1">👤 {post.author?.name || 'Unknown'}</p>

                {/* Tiêu đề */}
                <Link href={`/post/${post._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 hover:underline mb-1">
                        {post.title}
                    </h2>
                </Link>

                {/* Tóm tắt nội dung */}
                <div className="text-gray-700 text-sm line-clamp-2 mb-2">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Metadata: thời gian, lượt xem, bình luận, bookmark */}
                <div className="flex items-center text-xs text-gray-500 space-x-4 mt-2">
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
                    <span>
                        <Image src="/bookmark.png" alt="bookmark" width={14} height={14} />
                    </span>
                </div>
            </div>

            {/* Bên phải: ảnh bìa */}
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
