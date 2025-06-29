// src/components/PostCard.tsx
'use client';

import Link from 'next/link';

type Post = {
    id: string;
    title: string;
    summary: string;
    author: string;
    date: string;
};

export default function PostCard({ post }: { post: Post }) {
    return (
        <div className="border p-4 rounded-xl mb-4 shadow hover:shadow-md">
            <Link href={`/post/${post.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-600 mt-1">{post.summary}</p>
            <span className="text-sm text-gray-400 mt-2 block">
                By {post.author} • {post.date}
            </span>
        </div>
    );
}
// This component renders a single post card with a title, summary, author, and date.
