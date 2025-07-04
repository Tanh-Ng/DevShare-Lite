// src/app/post/[id]/page.tsx
import { mockPosts } from '../../data/mockPosts';
import { useRouter } from 'next/router';
export default function PostDetail() {
    const { id } = useRouter().query;
    const post = mockPosts.find((p) => p.id === id);

    if (!post) return <p>Post not found</p>;

    return (
        <div className="max-w-3xl mx-auto mt-6 px-4">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-500 text-sm mb-4">By {post.author} • {post.date}</p>
            <p className="text-lg leading-7">{post.content}</p>
        </div>
    );
}
