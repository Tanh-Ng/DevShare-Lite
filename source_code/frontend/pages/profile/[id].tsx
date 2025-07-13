// pages/profile/[id].tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PostCard from '../../components/PostCard';

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [userRes, postsRes] = await Promise.all([
                    fetch(`http://localhost:3000/users/${id}`),
                    fetch(`http://localhost:3000/posts/by-author/${id}`)
                ]);

                const userData = await userRes.json();
                const postData = await postsRes.json();

                setUser(userData);
                setPosts(postData);
            } catch (err) {
                console.error('Lỗi tải dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-4 text-center text-gray-600">Đang tải...</div>;
    if (!user) return <div className="p-4 text-center text-red-500">Không tìm thấy người dùng.</div>;

    const joinedDate = user.joined
        ? new Date(user.joined).toLocaleDateString('vi-VN')
        : 'Không rõ';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Thông tin người dùng */}
            <div className="flex items-center gap-4 mb-6 border-b pb-6">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl || '/avatar.png'} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full" />
                )}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 italic">Tham gia: {joinedDate}</p>
                    {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                </div>
            </div>

            {/* Danh sách bài viết */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Bài viết</h3>
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-gray-500 italic">Người dùng này chưa có bài viết nào.</p>
                ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
            </div>
        </div>
    );
}
