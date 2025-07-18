// pages/profile/index.tsx
'use client';

import { useCurrentUser } from '../../hooks/useCurrentUser';
import PostCard from '../../components/PostCard';
import { useEffect, useState } from 'react';
import { AvatarUploader } from '../../components/AvatarUploader';
import { BioEditor } from '../../components/BioEditor';

type Post = {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    views: number;
    coverImage?: string;
    likes?: string[];
    comments?: string[];
    author: {
        _id: string;
        username: string;
        avatarUrl?: string;
    };
};

export default function MyProfilePage() {
    const { user, loading, refresh } = useCurrentUser();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (!user?._id) return;

        fetch(`http://localhost:3000/posts/by-author/${user._id}`)
            .then((res) => res.json())
            .then(setPosts)
            .catch((err) => console.error('Error loading posts:', err));
    }, [user]);

    if (loading || !user) return <p className="p-4">Đang tải...</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold">Hồ sơ cá nhân của bạn</h1>

            {/* Thông tin cá nhân */}
            <div className="flex items-start gap-4">
                <AvatarUploader
                    avatarUrl={user.avatarUrl || ''}
                    avatarPublicId={user.avatarPublicId}
                    userId={user._id}
                    onUpdated={() => refresh()}
                />
                <div>
                    <p className="text-lg font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Đã tham gia: {new Date(user.joined || '').toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                        <BioEditor
                            bio={user.bio || ''}
                            onSave={async (newBio) => {
                                const token = localStorage.getItem('token');
                                await fetch('http://localhost:3000/users/me/bio', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ bio: newBio }),
                                });
                                await refresh(); // refresh lại thông tin sau khi cập nhật
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Danh sách bài viết */}
            <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold">Bài viết của bạn</h2>
                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                    <p className="text-gray-500">Bạn chưa có bài viết nào.</p>
                )}
            </div>
        </div>
    );
}
